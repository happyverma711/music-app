import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  const envInfo = {
    has_MONGO_URL: !!process.env.MONGO_URL,
    has_MONGO_URI: !!process.env.MONGO_URI,
    has_CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    has_CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    has_CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    // Helping you see what Vercel *does* see
    hint: "If all of these are false, your Vercel project is not receiving any custom environment variables."
  };
  
  return NextResponse.json(envInfo);
}
