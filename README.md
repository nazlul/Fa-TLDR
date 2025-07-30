# ⚡ TLDR - Farcaster Mini App

A beautiful, AI-powered text summarizer built specifically for the Farcaster ecosystem. Summarize text, websites, and Farcaster posts instantly with a modern, responsive interface.

![TLDR App](https://img.shields.io/badge/TLDR-Farcaster%20Mini%20App-purple?style=for-the-badge&logo=lightning)

## ✨ Features

- **🤖 AI-Powered Summarization** - Powered by Hugging Face API for free, high-quality summaries
- **🌐 Multi-Input Support** - Text, website URLs, and Farcaster posts
- **🎨 Beautiful UI** - Modern design with dark/light theme toggle
- **📱 Farcaster Optimized** - Built as a Farcaster mini-app
- **⚡ Real-time Processing** - Instant summarization with loading states
- **📊 Smart Analytics** - Character count and reduction percentage
- **🎯 Customizable Length** - Short, medium, or long summaries
- **📋 One-Click Copy** - Copy summaries to clipboard instantly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Hugging Face account (free, no payment required)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file:
```env
HUGGINGFACE_API_KEY=hf_your-huggingface-api-key-here
NEYNAR_API_KEY=your-neynar-key-here  # Optional, for better Farcaster support
```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Getting Your Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/) and create a free account
2. Go to [Settings > Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" role
4. Copy the token (starts with `hf_`) to your `.env.local` file

## 🎯 How It Works

### Input Modes
1. **📝 Text Input** - Paste any text directly
2. **🌐 Website URLs** - Automatically extracts and summarizes web content
3. **🚀 Farcaster Posts** - Special handling for Warpcast URLs

### Summary Lengths
- **Short**: ~100 words (1-2 sentences)
- **Medium**: ~150 words (2-3 sentences)  
- **Long**: ~250 words (3-4 sentences)

### Supported Content Types
- Articles and blog posts
- News stories
- Documentation
- Social media posts
- Farcaster posts
- Any text content

## 🛠️ Technical Details

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Farcaster palette
- **AI**: Hugging Face API (facebook/bart-large-cnn)
- **Deployment**: Vercel-ready
- **Language**: TypeScript

### API Endpoints
- `POST /api/summarize` - Main summarization endpoint
- Supports text, URL, and Farcaster post modes

### Environment Variables
```env
HUGGINGFACE_API_KEY=hf_your-api-key
NEYNAR_API_KEY=your-neynar-key  # Optional
```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Farcaster-inspired purple/blue gradients
- **Typography**: Inter font family
- **Components**: Custom button, input, and card components
- **Animations**: Smooth transitions and loading states

### Theme Support
- **Light Mode**: Clean, modern interface
- **Dark Mode**: Eye-friendly dark theme
- **Auto-Detect**: Respects system preferences
- **Persistent**: Remembers user's choice

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `HUGGINGFACE_API_KEY`
   - `NEYNAR_API_KEY` (optional)

### Other Platforms
Add the environment variables to your hosting platform's configuration.

## 🔧 Development

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── page.tsx           # Main page
│   └── TLDRApp.tsx        # Main app component
├── components/             # React components
│   └── ui/                # UI components
├── lib/                    # Utilities and helpers
└── hooks/                  # Custom React hooks
```

## 🔍 Troubleshooting

### Common Issues

**"Hugging Face API key not configured"**
- Check that `HUGGINGFACE_API_KEY` is set in `.env.local`
- Restart the development server after adding the key

**"Failed to generate summary"**
- Verify your Hugging Face account is active
- Check the API key format (should start with `hf_`)
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
- Hugging Face is completely free
- 30,000 requests per month included
- No need to worry about costs at all
- Perfect for unlimited usage

### Security
- Never commit your API key to Git
- Use environment variables for all sensitive data
- Rotate API keys periodically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Hugging Face](https://huggingface.co/)
- Designed for [Farcaster](https://farcaster.xyz/)

---

**Ready to summarize?** Get your Hugging Face API key and start building! 🚀

For detailed setup instructions, see [HUGGINGFACE_SETUP.md](./HUGGINGFACE_SETUP.md)

