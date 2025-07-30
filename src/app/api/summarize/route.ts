import { NextRequest, NextResponse } from "next/server";
import { getFarcasterPost, isValidFarcasterUrl } from "~/lib/farcaster";

async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TLDR-Bot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Simple content extraction - remove HTML tags and get text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Limit content length to avoid token limits
    return textContent.substring(0, 8000);
  } catch (error) {
    throw new Error(`Failed to extract content from URL: ${error}`);
  }
}

async function extractFarcasterPost(url: string): Promise<string> {
  try {
    if (!isValidFarcasterUrl(url)) {
      throw new Error("Invalid Farcaster post URL format");
    }
    
    return await getFarcasterPost(url);
  } catch (error) {
    throw new Error(`Failed to extract Farcaster post content: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, mode = "text", length = "medium" } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    let textToSummarize = content;

    // Extract content based on mode
    if (mode === "url") {
      try {
        textToSummarize = await extractContentFromUrl(content);
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to extract content from URL: ${error}` },
          { status: 400 }
        );
      }
    } else if (mode === "post") {
      try {
        textToSummarize = await extractFarcasterPost(content);
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to extract Farcaster post content: ${error}` },
          { status: 400 }
        );
      }
    }

    if (!textToSummarize.trim()) {
      return NextResponse.json(
        { error: "No content found to summarize" },
        { status: 400 }
      );
    }

    // Determine summary length based on user selection
    let maxTokens: number;
    let instruction: string;
    
    switch (length) {
      case "short":
        maxTokens = 100;
        instruction = "Provide a very brief TLDR in 1-2 sentences.";
        break;
      case "long":
        maxTokens = 300;
        instruction = "Provide a detailed TLDR in 3-4 sentences.";
        break;
      default: // medium
        maxTokens = 200;
        instruction = "Provide a concise TLDR in 2-3 sentences.";
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates clear, accurate TLDR summaries. Focus on the main points and key information. Keep it concise and easy to understand."
          },
          {
            role: "user",
            content: `${instruction}\n\nContent to summarize:\n${textToSummarize}`
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate TLDR" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "No TLDR generated" },
        { status: 500 }
      );
    }

    // Calculate statistics
    const originalLength = textToSummarize.length;
    const summaryLength = summary.length;
    const reduction = Math.round(((originalLength - summaryLength) / originalLength) * 100);

    return NextResponse.json({
      summary,
      originalLength,
      summaryLength,
      reduction,
    });

  } catch (error) {
    console.error("TLDR API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 