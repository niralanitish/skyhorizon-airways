# SkyHorizon Airways Backend - Vercel Deployment

This project has been migrated from Railway to be deployable on Vercel using Serverless Functions.

## Vercel Migration Details
- Removed Railway-specific configuration (such as `Dockerfile`).
- Added `vercel.json` for serverless Java builder integration.
- Added `api/index.java` as the primary serverless function entry point for Vercel.

## Deployment Instructions (Vercel CLI)
1. Install the Vercel CLI if you haven't already:
   ```bash
   npm i -g vercel
   ```
2. Run Vercel locally (optional for testing):
   ```bash
   vercel dev
   ```
3. Deploy to production:
   ```bash
   vercel --prod
   ```

## Deployment Instructions (GitHub Integration)
1. Push these changes to your GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. Vercel will automatically detect the `vercel.json` and deploy your API routes. No additional build settings are required since `vercel.json` dictates the setup.

### Note on Java Serverless Limitations
Due to the cold-start characteristics of Spring Boot and the 10-second timeout on Vercel's free tier, you may encounter `504 Gateway Timeout` errors on the first request if the application context takes too long to initialize. 
