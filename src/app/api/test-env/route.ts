import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
  const envPath = path.join(process.cwd(), '.env.local');
  const fileExists = fs.existsSync(envPath);
  
  let fileContent = '';
  if (fileExists) {
    fileContent = fs.readFileSync(envPath, 'utf8');
  }

  return NextResponse.json({
    fileExists,
    filePath: envPath,
    fileContent,
    hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY,
    hfKeyPreview: process.env.HUGGINGFACE_API_KEY 
      ? `${process.env.HUGGINGFACE_API_KEY.substring(0, 10)}...` 
      : 'Not found',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('HUGGINGFACE')),
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });
} 