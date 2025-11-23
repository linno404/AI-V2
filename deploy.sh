#!/bin/bash

# Xyonz-AI Netlify Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Xyonz-AI Netlify Deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
echo "🔐 Checking Netlify authentication..."
if ! netlify status; then
    echo "❌ Not logged in to Netlify. Please run: netlify login"
    echo "🌐 Opening browser for authentication..."
    netlify login
    exit 1
fi

# Build the project
echo "🔨 Building Next.js project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=out

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site is now live at: https://xyonz-ai.netlify.app"
else
    echo "❌ Deployment failed. Please check the errors above."
fi

echo "📝 Don't forget to set up environment variables in Netlify dashboard:"
echo "   - DATABASE_URL=file:./production.db"
echo "   - JWT_SECRET=your-super-secret-jwt-key"
echo "   - CEREBRAS_API_KEY=your-cerebras-api-key"