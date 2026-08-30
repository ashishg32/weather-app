# Deployment Guide

## GitHub Pages Setup

### Current Status
- ✅ GitHub Actions workflow configured ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
- ✅ Next.js configured for static export ([next.config.ts](next.config.ts))
- ⚠️ **Important**: The app currently uses server-side features that need modification for static export

### Limitations
GitHub Pages only serves static files. The following features won't work without changes:
- `/api/graphql` route (GraphQL API)
- Server-side data fetching in components
- Server actions (like `getFavorites`)

### Option 1: Deploy to Vercel (Recommended for Full Features)
Vercel provides free hosting with full Next.js support including SSR and API routes:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

### Option 2: Static Export for GitHub Pages
To make the app work on GitHub Pages, convert server features to client-side:

1. **Enable GitHub Pages**:
   - Go to your repo: https://github.com/ashishg32/weather-app/settings/pages
   - Under "Source", select "GitHub Actions"
   - Push changes to trigger deployment

2. **Required Code Changes**:
   - Convert server components to client components
   - Use Apollo Client for client-side GraphQL queries
   - Replace server actions with client-side state management
   - Call external weather API directly from client (or deploy API separately)

### Current Configuration
- **Base Path**: `/weather-app`
- **Output Directory**: `./out`
- **Expected URL**: `https://ashishg32.github.io/weather-app`

## Local Testing

Test static export locally:
```bash
npm run build
npx serve@latest out
```

## Deployment Status

Once deployed, your app will be available at:
**https://ashishg32.github.io/weather-app**
