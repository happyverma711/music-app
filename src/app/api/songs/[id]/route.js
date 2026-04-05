import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    // First, find the song so we can get its publicId
    const song = await Song.findById(id);
    if (!song) {
      return NextResponse.json({ message: 'Song not found' }, { status: 404 });
    }

    // Delete from Cloudinary if publicId exists
    if (song.publicId) {
      console.log(`Deleting from Cloudinary: ${song.publicId}`);
      try {
        await cloudinary.uploader.destroy(song.publicId, { resource_type: 'video' });
      } catch (cloudErr) {
        console.error('Error deleting from Cloudinary:', cloudErr);
      }
    }

    // Now delete from the database
    await Song.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ message: 'Error deleting song', error: error.message }, { status: 500 });
  }
}
