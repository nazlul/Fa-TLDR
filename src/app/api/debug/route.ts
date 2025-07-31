import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Manually load .env.local
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    }
  }
}

// Load environment variables
loadEnvLocal();

export async function GET() {
  const hfApiKey = process.env.HUGGINGFACE_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!hfApiKey,
    keyLength: hfApiKey ? hfApiKey.length : 0,
    keyStartsWithHf: hfApiKey ? hfApiKey.startsWith('hf_') : false,
    keyPreview: hfApiKey ? `${hfApiKey.substring(0, 10)}...` : 'Not found',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('HUGGINGFACE'))
  });
} 