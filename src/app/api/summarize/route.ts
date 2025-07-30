import { NextRequest, NextResponse } from "next/server";
import { getFarcasterPost, isValidFarcasterUrl } from "~/lib/farcaster";

// Simple HTML content extraction
async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Simple text extraction - remove HTML tags
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return text.substring(0, 8000); // Limit to avoid token limits
  } catch (error) {
    throw new Error(`Failed to fetch content from URL: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, mode, length } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let textToSummarize = "";
    let source = "";

    // Extract content based on mode
    if (mode === "text") {
      textToSummarize = content;
      source = "Direct text input";
    } else if (mode === "url") {
      textToSummarize = await extractContentFromUrl(content);
      source = content;
    } else if (mode === "post") {
      if (isValidFarcasterUrl(content)) {
        textToSummarize = await getFarcasterPost(content);
        source = content;
      } else {
        return NextResponse.json({ error: "Invalid Farcaster post URL" }, { status: 400 });
      }
    }

    if (!textToSummarize.trim()) {
      return NextResponse.json({ error: "No content found to summarize" }, { status: 400 });
    }

    // Determine summary length
    let maxTokens = 150;
    if (length === "short") maxTokens = 100;
    else if (length === "long") maxTokens = 250;

    // Use Perplexity API instead of OpenAI
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityApiKey) {
      return NextResponse.json({ error: "Perplexity API key not configured" }, { status: 500 });
    }

    const prompt = `Please provide a concise TLDR summary of the following text. Make it ${length} length (${maxTokens} words max). Focus on the key points and main ideas:

${textToSummarize}

TLDR:`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${perplexityApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate summary");
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim() || "No summary generated";

    // Calculate statistics
    const originalLength = textToSummarize.length;
    const summaryLength = summary.length;
    const reduction = Math.round(((originalLength - summaryLength) / originalLength) * 100);

    return NextResponse.json({
      summary,
      originalLength,
      summaryLength,
      reduction,
      source,
    });

  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      { status: 500 }
    );
  }
} 