export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';

export async function GET() {
  try {
    await dbConnect();
    const songs = await Song.find().sort({ createdAt: -1 });
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ message: 'Error fetching songs', error: error.message }, { status: 500 });
  }
}
