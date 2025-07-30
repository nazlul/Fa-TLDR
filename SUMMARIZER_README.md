# TLDR - Farcaster Mini App

A powerful AI-powered text summarizer built specifically for Farcaster, built with Next.js, OpenAI API, and Tailwind CSS.

## Features

✅ **Farcaster Integration** - Summarize Farcaster posts directly from Warpcast URLs
✅ **Website Summarization** - Extract and summarize content from any website
✅ **Direct Text Input** - Paste any text for instant summarization
✅ **Multiple Summary Lengths** - Choose from short, medium, or long TLDRs
✅ **Real-time Statistics** - See character count and reduction percentage
✅ **Copy to Clipboard** - One-click copying of generated TLDRs
✅ **Error Handling** - Graceful error handling with user-friendly messages
✅ **Loading States** - Visual feedback during API calls

## How It Works

### For Farcaster Posts
1. **Copy Post URL**: Copy a Farcaster post URL from Warpcast (e.g., `https://warpcast.com/username/0x...`)
2. **Paste in TLDR**: Select "Post" mode and paste the URL
3. **Get TLDR**: The app extracts the post content and generates a summary

### For Websites
1. **Copy Website URL**: Copy any article or webpage URL
2. **Paste in TLDR**: Select "Website" mode and paste the URL
3. **Get TLDR**: The app extracts the main content and generates a summary

### For Direct Text
1. **Paste Text**: Copy any text you want to summarize
2. **Paste in TLDR**: Select "Text" mode and paste the content
3. **Get TLDR**: The app generates an instant summary

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the API key

### 2. Get Neynar API Key (Optional)

For better Farcaster post extraction:
1. Go to [Neynar](https://neynar.com/)
2. Create an account and get your API key
3. Add it to your environment variables

### 3. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEYNAR_API_KEY=your_neynar_api_key_here  # Optional
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Access TLDR

1. Open your browser and go to `http://localhost:3000`
2. Click on the "TLDR" tab (⚡ icon) in the bottom navigation
3. Start summarizing content!

## How to Use

1. **Choose Input Mode**: Select between Text, Website, or Post
2. **Enter Content**: Paste text, URL, or Farcaster post URL
3. **Choose Length**: Select your preferred TLDR length:
   - **Short**: 1-2 sentences
   - **Medium**: 2-3 sentences (default)
   - **Long**: 3-4 sentences
4. **Generate TLDR**: Click the "Summarize" button
5. **Copy Result**: Use the "Copy Summary" button to copy the result

## API Endpoint

The TLDR uses the `/api/summarize` endpoint which:

- Accepts POST requests with `content`, `mode`, and `length` parameters
- Supports three modes: `text`, `url`, `post`
- Uses OpenAI's GPT-3.5-turbo model
- Returns TLDR with statistics (original length, summary length, reduction percentage)
- Includes proper error handling and validation

## Technical Details

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **AI Model**: OpenAI GPT-3.5-turbo
- **Farcaster Integration**: Neynar API + web scraping fallback
- **State Management**: React hooks (useState)
- **Error Handling**: Comprehensive error handling with user feedback

## Farcaster Integration

The app integrates with Farcaster in several ways:

1. **Neynar API**: Uses Neynar's API to fetch post content when available
2. **Web Scraping**: Falls back to web scraping for Warpcast URLs
3. **URL Validation**: Validates Farcaster post URLs before processing
4. **Content Extraction**: Extracts clean text content from posts

## Customization

You can easily customize TLDR by:

- **Modifying Summary Lengths**: Edit the token limits in `/src/app/api/summarize/route.ts`
- **Changing AI Model**: Switch to GPT-4 or other models in the API call
- **Adding Features**: Implement save functionality, export options, or language support
- **Styling**: Customize the UI using Tailwind CSS classes
- **Farcaster Features**: Add more Farcaster-specific functionality

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Make sure you've added your API key to `.env.local`
   - Restart your development server after adding the environment variable

2. **"Failed to generate TLDR"**
   - Check your internet connection
   - Verify your OpenAI API key is valid
   - Ensure you have sufficient OpenAI credits

3. **"Invalid Farcaster post URL format"**
   - Make sure the URL is from Warpcast (e.g., `https://warpcast.com/username/0x...`)
   - Check that the URL contains a valid post hash

4. **"Failed to extract content from URL"**
   - The website might be blocking automated requests
   - Try a different URL or use the text input mode

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure and don't share them publicly
- Consider implementing rate limiting for production use
- Be mindful of website terms of service when scraping content

## Future Enhancements

Potential features you could add:

- Save TLDRs to local storage
- Export TLDRs to different formats (PDF, DOCX)
- Support for multiple languages
- Batch processing of multiple posts
- Custom TLDR styles (bullet points, numbered lists)
- Integration with other AI models
- Farcaster post sharing with TLDR
- User authentication and TLDR history

## Support

If you encounter any issues or have questions, please check the main project documentation or create an issue in the repository. 