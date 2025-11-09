# R_LUMINA Setup Guide

## AI Risk Advisor Configuration

The AI Risk Advisor requires an Anthropic API key to function. Follow these steps:

### 1. Get an Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

### 2. Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Add your API key:

```bash
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

3. Save the file
4. Restart your development server

### 3. Verify It Works

1. Click the AI Risk Advisor button (floating button with sparkles icon)
2. Type a question like "Hello" or "How do I classify project risks?"
3. You should receive an intelligent, detailed response

### Without an API Key

The AI Risk Advisor will still work with a fallback mode that provides general guidance, but it won't have the full intelligence of Claude 3.5 Sonnet.

All other R_LUMINA features (Risk Register, Monte Carlo, FMEA, Bow-Tie, etc.) work independently of the API key.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your API key is correctly set in `.env.local`
3. Ensure your Anthropic account has available credits
4. Try refreshing the page
