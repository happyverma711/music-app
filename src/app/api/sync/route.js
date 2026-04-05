import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';
import cloudinary from '@/lib/cloudinary';

// Helper function to format seconds into M:SS
const formatDuration = (seconds) => {
  if (!seconds) return "3:30";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export async function GET() {
  try {
    console.log('Syncing with Cloudinary (Next.js API)...');
    await dbConnect();

    // 1. Get the list of audio files
    let response = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video', 
      prefix: 'music_playlist/',
      max_results: 500
    });

    let resources = response?.resources || [];

    // Fallback if folder search is empty
    if (resources.length === 0) {
      let rootResponse = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'video',
        max_results: 100
      });
      resources = (rootResponse?.resources || []).filter(r => 
        (r.format === 'mp3' || r.secure_url?.endsWith('.mp3')) && 
        !r.public_id?.includes('samples/')
      );
    }
    
    console.log(`Found ${resources.length} resources. Fetching individual durations...`);

    const syncedSongs = [];
    const cloudinaryPublicIds = resources.map(r => r.public_id);
    const cloudinaryUrls = resources.map(r => r.secure_url);

    // 2. Fetch DETAILS (including duration) for each resource
    for (const resItem of resources) {
       try {
          const details = await cloudinary.api.resource(resItem.public_id, { resource_type: 'video' });
          const resource = { ...resItem, duration: details.duration };
          
          let fullName = resource.public_id.replace('music_playlist/', '');
          fullName = fullName.replace(/_[a-z0-0]{6}$/, '').replace(/_/g, ' ');

          let title = fullName;
          let artist = "Unknown Artist";
          if (fullName.includes(' - ')) {
            const parts = fullName.split(' - ');
            title = parts[0].trim();
            artist = parts[1].trim();
          }

          let song = await Song.findOne({ publicId: resource.public_id });
          if (!song) song = await Song.findOne({ audioUrl: resource.secure_url });

          const realDuration = formatDuration(resource.duration);

          if (!song) {
            song = new Song({
              title,
              artist,
              audioUrl: resource.secure_url,
              publicId: resource.public_id,
              duration: realDuration,
              coverImage: 'https://i.pinimg.com/736x/b2/30/bd/b230bdd1857ec9a1ef610e3509540b9a.jpg'
            });
            await song.save();
          } else {
            // Update existing
            let changed = false;
            if (song.duration !== realDuration) { song.duration = realDuration; changed = true; }
            if (song.audioUrl !== resource.secure_url) { song.audioUrl = resource.secure_url; changed = true; }
            if (song.publicId !== resource.public_id) { song.publicId = resource.public_id; changed = true; }
            if (changed) await song.save();
          }
          syncedSongs.push(song);
       } catch (err) {
          console.error(`Error fetching details for ${resItem.public_id}:`, err);
       }
    }

    // --- Cleanup Phase ---
    if (resources.length > 0) {
      const dbSongs = await Song.find({});
      for (const dbSong of dbSongs) {
        let isOrphan = false;
        if (dbSong.publicId) {
          if (!cloudinaryPublicIds.includes(dbSong.publicId)) isOrphan = true;
        } else if (dbSong.audioUrl) {
          if (!cloudinaryUrls.includes(dbSong.audioUrl)) isOrphan = true;
        }
        if (isOrphan) await Song.findByIdAndDelete(dbSong._id);
      }
    }

    return NextResponse.json({
      message: resources.length > 0 ? 'Sync complete!' : 'No songs were found.',
      count: resources.length,
      syncedCount: syncedSongs.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ message: 'Error syncing', error: error.message }, { status: 500 });
  }
}
