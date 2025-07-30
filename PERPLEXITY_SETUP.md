# 🚀 TLDR App - Perplexity API Setup Guide

## Why Perplexity Pro is Better for TLDR

✅ **Unlimited Requests** - No per-request costs  
✅ **Better Quality** - Often superior to GPT-3.5 for summarization  
✅ **Real-time Web Access** - Can fetch and summarize live content  
✅ **Cost Effective** - $20/month flat rate vs per-token pricing  

## 🔑 Getting Your Perplexity API Key

### Step 1: Access Perplexity API
1. Go to [Perplexity API Console](https://console.perplexity.ai/)
2. Sign in with your Perplexity Pro account
3. Navigate to "API Keys" section

### Step 2: Create API Key
1. Click "Create API Key"
2. Give it a name like "TLDR App"
3. Copy the generated API key (starts with `pplx-`)

### Step 3: Configure Environment
1. Create `.env.local` file in your project root:
```bash
# Perplexity API Configuration
PERPLEXITY_API_KEY=pplx-your-api-key-here

# Optional: Neynar API for better Farcaster support
NEYNAR_API_KEY=your-neynar-key-here
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local` file:
```env
PERPLEXITY_API_KEY=pplx-your-actual-api-key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test the App
- Open http://localhost:3000
- Try summarizing some text
- Test with Farcaster posts and websites

## 🔧 API Configuration Details

### Perplexity API Endpoint
- **URL**: `https://api.perplexity.ai/chat/completions`
- **Model**: `llama-3.1-sonar-small-128k-online`
- **Rate Limit**: Unlimited with Perplexity Pro
- **Cost**: $20/month flat rate

### Supported Input Types
1. **Text Input**: Direct text pasting
2. **Website URLs**: Automatic content extraction
3. **Farcaster Posts**: Special handling for Warpcast URLs

### Summary Lengths
- **Short**: ~100 words (1-2 sentences)
- **Medium**: ~150 words (2-3 sentences)  
- **Long**: ~250 words (3-4 sentences)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `PERPLEXITY_API_KEY`
   - `NEYNAR_API_KEY` (optional)

### Other Platforms
Add the environment variables to your hosting platform's configuration.

## 🔍 Troubleshooting

### Common Issues

**"Perplexity API key not configured"**
- Check that `PERPLEXITY_API_KEY` is set in `.env.local`
- Restart the development server after adding the key

**"Failed to generate summary"**
- Verify your Perplexity Pro subscription is active
- Check the API key format (should start with `pplx-`)
- Try with a simple text input first

**"Invalid Farcaster post URL"**
- Ensure the URL is from Warpcast
- Format should be: `https://warpcast.com/username/0x...`

### Testing Your Setup

1. **Test with Simple Text**:
   ```
   "The quick brown fox jumps over the lazy dog. This is a test sentence to verify the summarization is working correctly."
   ```

2. **Test with Website**:
   ```
   https://example.com
   ```

3. **Test with Farcaster Post**:
   ```
   https://warpcast.com/username/0x123...
   ```

## 💡 Pro Tips

### For Better Summaries
- Use clear, well-structured input text
- For websites, the app extracts main content automatically
- Farcaster posts work best with longer, detailed posts

### Cost Optimization
- Perplexity Pro gives unlimited requests
- No need to worry about token limits
- Perfect for high-volume usage

### Security
- Never commit your API key to Git
- Use environment variables for all sensitive data
- Rotate API keys periodically

## 🎯 Next Steps

1. **Get your Perplexity API key** from the console
2. **Create `.env.local`** with your key
3. **Test the app** with different content types
4. **Deploy to Vercel** for production use
5. **Share with Farcaster community**! 🚀

---

**Need Help?** Check the main README.md for more details or open an issue on GitHub. 