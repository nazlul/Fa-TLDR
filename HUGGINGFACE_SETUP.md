# 🚀 TLDR App - Hugging Face API Setup Guide

## Why Hugging Face API is Perfect for TLDR

✅ **Completely FREE** - No payment details required  
✅ **No Credit Card** - Just sign up with email  
✅ **Generous Limits** - 30,000 requests per month free  
✅ **High Quality** - Uses BART model specifically trained for summarization  
✅ **Reliable** - Stable, production-ready API  

## 🔑 Getting Your Hugging Face API Key

### Step 1: Create Free Account
1. Go to [Hugging Face](https://huggingface.co/)
2. Click "Sign Up" (no payment required)
3. Use your email to create account
4. Verify your email address

### Step 2: Get API Key
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name like "TLDR App"
4. Select "Read" role (that's all you need)
5. Copy the generated token (starts with `hf_`)

### Step 3: Configure Environment
1. Create `.env.local` file in your project root:
```bash
# Hugging Face API Configuration (FREE)
HUGGINGFACE_API_KEY=hf_your-api-key-here

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
HUGGINGFACE_API_KEY=hf_your-actual-api-key
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

### Hugging Face Inference API
- **URL**: `https://api-inference.huggingface.co/models/facebook/bart-large-cnn`
- **Model**: `facebook/bart-large-cnn` (specialized for summarization)
- **Rate Limit**: 30,000 requests/month FREE
- **Cost**: $0 - Completely free!
- **Quality**: Excellent for summarization tasks

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
   - `HUGGINGFACE_API_KEY`
   - `NEYNAR_API_KEY` (optional)

### Other Platforms
Add the environment variables to your hosting platform's configuration.

## 🔍 Troubleshooting

### Common Issues

**"Hugging Face API key not configured"**
- Check that `HUGGINGFACE_API_KEY` is set in `.env.local`
- Restart the development server after adding the key
- Ensure the key starts with `hf_`

**"Failed to generate summary"**
- Verify your Hugging Face account is active
- Check the API key format (should start with `hf_`)
- Try with a simple text input first
- The model might take a few seconds to load on first request

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
- The BART model is specifically trained for summarization

### Cost Optimization
- Hugging Face is completely free
- 30,000 requests per month included
- No need to worry about costs at all
- Perfect for unlimited usage

### Security
- Never commit your API key to Git
- Use environment variables for all sensitive data
- The free tier is very generous

## 🎯 Next Steps

1. **Get your Hugging Face API key** from the settings
2. **Create `.env.local`** with your key
3. **Test the app** with different content types
4. **Deploy to Vercel** for production use
5. **Share with Farcaster community**! 🚀

## 🔄 Alternative: Local Ollama (Even More Free!)

If you want to run completely locally with no API calls:

### Install Ollama
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

### Pull Summarization Model
```bash
ollama pull llama2:7b
```

### Use Local Model
The app can be configured to use Ollama instead of Hugging Face API for completely free, local processing.

---

**Need Help?** Check the main README.md for more details or open an issue on GitHub. 