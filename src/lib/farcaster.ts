/**
 * Farcaster API utilities for TLDR mini app
 */

interface FarcasterPost {
  hash: string;
  author: {
    fid: number;
    username: string;
    displayName: string;
  };
  text: string;
  timestamp: number;
  reactions: {
    likes: number;
    recasts: number;
  };
  replies: {
    count: number;
  };
}

export async function getFarcasterPost(url: string): Promise<string> {
  try {
    // Extract hash from Warpcast URL
    const hashMatch = url.match(/\/0x([a-fA-F0-9]{64})/);
    if (!hashMatch) {
      throw new Error("Invalid Farcaster post URL format");
    }
    
    const hash = `0x${hashMatch[1]}`;
    
    // Use Neynar API to get post data
    const neynarApiKey = process.env.NEYNAR_API_KEY;
    if (!neynarApiKey) {
      // Fallback to web scraping if no API key
      return await scrapeFarcasterPost(url);
    }
    
    const response = await fetch(`https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`, {
      headers: {
        'api_key': neynarApiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const data = await response.json();
    const post = data.cast as FarcasterPost;
    
    if (!post || !post.text) {
      throw new Error("No post content found");
    }
    
    return post.text;
  } catch (error) {
    console.error("Error fetching Farcaster post:", error);
    // Fallback to web scraping
    return await scrapeFarcasterPost(url);
  }
}

async function scrapeFarcasterPost(url: string): Promise<string> {
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
    
    // Try to extract post content from Warpcast page
    // Look for common selectors that might contain the post text
    const textSelectors = [
      '[data-testid="cast-text"]',
      '.cast-text',
      '[class*="cast"]',
      '[class*="post"]',
      'p',
    ];
    
    for (const selector of textSelectors) {
      const element = html.match(new RegExp(`<[^>]*class="[^"]*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'i'));
      if (element && element[1]) {
        const text = element[1].trim();
        if (text.length > 10) {
          return text;
        }
      }
    }
    
    // Fallback: extract all text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return textContent.substring(0, 4000);
  } catch (error) {
    throw new Error(`Failed to scrape Farcaster post: ${error}`);
  }
}

export function isValidFarcasterUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?warpcast\.com\/[^\/]+\/0x[a-fA-F0-9]{64}/.test(url);
} 