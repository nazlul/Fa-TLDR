import { NextResponse } from "next/server";

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