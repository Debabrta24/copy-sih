# Step-by-Step Vercel Deployment Guide for ApnaMann

This guide will help you deploy your ApnaMann mental health platform to Vercel with a production database.

## Prerequisites

1. **Vercel Account**: Sign up at [https://vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Neon Database Account**: Sign up at [https://neon.tech](https://neon.tech) for PostgreSQL database

## Step 1: Prepare Your Database

### 1.1 Create Neon Database
1. Go to [https://neon.tech](https://neon.tech) and sign up/login
2. Click "Create a project"
3. Choose a project name (e.g., "apnamann-production")
4. Select a region close to your users
5. Keep the default PostgreSQL version
6. Click "Create project"

### 1.2 Get Database Connection String
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require
   ```
3. Save this - you'll need it for Vercel environment variables

### 1.3 Setup Database Schema
1. In your Neon dashboard, go to "SQL Editor"
2. Run these SQL commands to create the necessary tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    institution TEXT NOT NULL,
    course TEXT,
    year INTEGER,
    language TEXT DEFAULT 'en',
    is_admin BOOLEAN DEFAULT false,
    coins INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create coin_transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create other required tables (screening_assessments, appointments, etc.)
-- Add the rest of your schema here based on shared/schema.ts
```

## Step 2: Push Code to GitHub

### 2.1 Create GitHub Repository
1. Go to [https://github.com](https://github.com)
2. Click "New repository"
3. Name it "apnamann-platform" (or your preferred name)
4. Make it public or private
5. Click "Create repository"

### 2.2 Push Your Code
If you're starting from Replit:
1. Download your project files
2. In terminal/command prompt:
```bash
git init
git add .
git commit -m "Initial commit - ApnaMann mental health platform"
git branch -M main
git remote add origin https://github.com/yourusername/apnamann-platform.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [https://vercel.com](https://vercel.com) and login
2. Click "New Project"
3. Connect your GitHub account if not already connected
4. Find your "apnamann-platform" repository
5. Click "Import"

### 3.2 Configure Build Settings
1. **Framework Preset**: Select "Other"
2. **Root Directory**: Leave as "./" (default)
3. **Build Command**: Use `npm run build`
4. **Output Directory**: Leave as default
5. **Install Command**: Use `npm install`

### 3.3 Set Environment Variables
Click on "Environment Variables" and add these:

**Required Variables:**
```
DATABASE_URL = your_neon_database_connection_string
NODE_ENV = production
OPENAI_API_KEY = your_openai_api_key (if using AI features)
SESSION_SECRET = a_random_string_for_session_security
```

**Optional Variables (for additional features):**
```
GOOGLE_AI_API_KEY = your_google_ai_key (if using Google AI)
TWILIO_ACCOUNT_SID = your_twilio_sid (for SMS features)
TWILIO_AUTH_TOKEN = your_twilio_token
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://apnamann-platform.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Test Your Deployment
1. Visit your Vercel URL
2. Test user registration and login
3. Verify the coin system is working
4. Test all major features

### 4.2 Setup Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `apnamann.com`)
4. Follow Vercel's instructions to configure DNS

### 4.3 Configure Production Database Schema
If you haven't run the full schema setup:
1. Use a database management tool like Drizzle Studio or pgAdmin
2. Connect to your Neon database
3. Run all necessary CREATE TABLE statements from your `shared/schema.ts`

## Step 5: Ongoing Maintenance

### 5.1 Automatic Deployments
- Any push to your main branch will automatically deploy to Vercel
- Create feature branches for development
- Use pull requests for code review before merging

### 5.2 Monitor Your Application
1. **Vercel Analytics**: Check performance and usage
2. **Database Monitoring**: Monitor Neon database performance
3. **Error Tracking**: Set up error monitoring (Sentry, LogRocket, etc.)

### 5.3 Scaling Considerations
- **Database**: Neon scales automatically with usage
- **Vercel**: Upgrade to Pro plan for higher limits if needed
- **CDN**: Vercel includes global CDN automatically

## Step 6: Security Best Practices

### 6.1 Environment Variables
- Never commit API keys or secrets to GitHub
- Use Vercel's environment variable system
- Rotate secrets regularly

### 6.2 Database Security
- Use connection pooling (Neon provides this)
- Enable SSL (already enabled with Neon)
- Regular security updates

### 6.3 Application Security
- Implement rate limiting for APIs
- Validate all user inputs
- Use HTTPS only (Vercel provides this automatically)

## Troubleshooting Common Issues

### Build Failures
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon database is running
- Ensure IP allowlist includes Vercel IPs (usually not needed with Neon)

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints individually

## Support and Resources

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Neon Documentation**: [https://neon.tech/docs](https://neon.tech/docs)
- **Next.js/React Resources**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

## Summary

Your ApnaMann platform is now deployed with:
- ✅ Coin system (10 coins = ₹1)
- ✅ Mental health screening tools
- ✅ AI chat functionality
- ✅ User management
- ✅ Crisis intervention features
- ✅ Production PostgreSQL database
- ✅ Global CDN and HTTPS
- ✅ Automatic deployments

Your application is ready to help Indian college students with their mental health needs!