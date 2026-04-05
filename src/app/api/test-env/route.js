import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  const envInfo = {
    has_MONGO_URL: !!process.env.MONGO_URL,
    has_MONGO_URI: !!process.env.MONGO_URI,
    has_CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    has_CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    has_CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    // Add Vercel internal info
    vercel_env: process.env.VERCEL_ENV || "NOT FOUND",
    node_env: process.env.NODE_ENV || "NOT FOUND",
    // Helping you see what Vercel *does* see
    hint: "If vercel_env is 'NOT FOUND', something is very wrong with the deployment environment."
  };
  
  return NextResponse.json(envInfo);
}
