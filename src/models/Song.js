import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String, // URL from Cloudinary
    required: true,
  },
  publicId: {
    type: String, // Cloudinary Public ID for deletion
  },
  coverImage: {
    type: String, // URL of the cover image
    default: 'https://i.pinimg.com/736x/b2/30/bd/b230bdd1857ec9a1ef610e3509540b9a.jpg',
  },
  duration: {
    type: String, // e.g., '3:45'
    default: '3:30',
  }
}, { timestamps: true });

// Check if the model is already exists to avoid Re-compilation Error
export default mongoose.models.Song || mongoose.model('Song', SongSchema);
