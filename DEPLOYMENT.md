# Deployment Guide - oResume

## Vercel Deployment

### Prerequisites
- GitHub repository with oResume code
- Vercel account
- Supabase project set up with database and storage
- OpenAI API key
- Razorpay account credentials

## Step-by-Step Deployment

### 1. Prepare Supabase

#### Database Setup
1. Log in to your Supabase dashboard
2. Go to SQL Editor
3. Create a new query and run `database/schema.sql`
4. Create another query and run `database/rls_policies.sql`
5. Verify all tables and policies are created

#### Storage Buckets
Create the following buckets in Supabase Storage:

1. **resumes**
   - Private bucket
   - Max file size: 5MB
   - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

2. **cover-letters**
   - Private bucket
   - Max file size: 5MB
   - Allowed MIME types: Same as resumes

3. **employer-logos**
   - Public bucket
   - Max file size: 2MB
   - Allowed MIME types: image/png, image/jpeg, image/jpg

4. **profile-pictures**
   - Public bucket
   - Max file size: 2MB
   - Allowed MIME types: image/png, image/jpeg, image/jpg

#### Collect Credentials
From your Supabase project settings, collect:
- Project URL (e.g., https://xxxxx.supabase.co)
- Anon public key
- Service role key (keep this secret!)

### 2. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - oResume platform"

# Add remote (replace with your repo URL)
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel

#### Using Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**

   Add the following environment variables in Vercel:

   ```
   # Application
   NEXT_PUBLIC_APP_URL=https://oresume.ostaran.com

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Redis (Optional - for vector search)
   REDIS_URL=your_redis_url
   REDIS_TOKEN=your_redis_token

   # Admin (Optional)
   ADMIN_EMAIL=admin@oresume.com
   ```

   **Important:** Make sure to set these for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Verify the deployment

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: Select your account
# - Link to existing project: N
# - Project name: oresume
# - Directory: ./
# - Override settings: N

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET

# Deploy to production
vercel --prod
```

### 4. Custom Domain Setup

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add domain: `oresume.ostaran.com`
4. Follow the instructions to configure DNS:
   - Add CNAME record: `oresume` → `cname.vercel-dns.com`
   - Or A record pointing to Vercel's IP

5. Wait for DNS propagation (can take up to 48 hours, usually minutes)

### 5. Post-Deployment Configuration

#### Enable Automatic Deployments
- In Vercel project settings → Git
- Enable: "Auto-deploy commits"
- Enable: "Auto-deploy branches"
- Configure which branches to deploy

#### Set up Preview Deployments
- Every push to non-production branches creates a preview
- Preview URLs: `<branch>-oresume.vercel.app`

#### Configure Build Settings
In Vercel project settings:
- Node.js Version: 18.x
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

### 6. Verify Deployment

1. **Homepage**: Visit https://oresume.ostaran.com
2. **Resume Upload**: Test at /upload
3. **API Health**: Check API routes
4. **Database Connection**: Verify Supabase connection
5. **File Upload**: Test file upload to Supabase Storage
6. **Authentication**: Test sign-up and sign-in flows

### 7. Monitoring & Logs

#### Vercel Dashboard
- View deployment logs
- Monitor function executions
- Check error rates
- View analytics

#### Set up Alerts
In Vercel project settings → Notifications:
- Deployment failed
- Deployment succeeded
- Function errors

## Environment-Specific Configuration

### Production
- All features enabled
- Real payment processing
- Production database
- Email notifications enabled

### Staging/Preview
- Test mode for payments
- Separate database (recommended)
- Email notifications to test addresses

### Development
- Local Supabase or development project
- Test mode for all external services
- Mock data

## Rollback Procedure

If deployment fails or issues arise:

1. **Via Vercel Dashboard**
   - Go to Deployments
   - Find the last working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**
   ```bash
   vercel rollback
   ```

3. **Via Git**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## CI/CD Pipeline

### Automatic Deployments
- Push to `main` → Production deployment
- Push to `staging` → Staging deployment
- Pull requests → Preview deployments

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Security Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] No secrets in code
- [ ] RLS policies enabled on all tables
- [ ] Storage bucket policies configured
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured for API routes
- [ ] Rate limiting implemented
- [ ] Admin access secured
- [ ] Audit logging enabled

## Performance Optimization

### Vercel Configuration
- Enable Edge Network
- Configure ISR (Incremental Static Regeneration) where applicable
- Use Edge Functions for geo-specific content

### Database
- Ensure indexes are created (already in schema.sql)
- Enable connection pooling
- Monitor query performance

### Storage
- Use Supabase CDN for public files
- Implement image optimization
- Set appropriate cache headers

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure TypeScript compiles: `npm run type-check`

### Database Connection Issues
- Verify Supabase credentials
- Check if database is accessible
- Verify RLS policies allow required operations

### File Upload Issues
- Check Supabase Storage bucket configuration
- Verify storage policies
- Check file size limits

### Environment Variables Not Working
- Ensure variables are set for correct environment
- Redeploy after adding new variables
- Check variable names match exactly

## Support & Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs

## Maintenance

### Regular Tasks
- Monitor error logs
- Review security alerts
- Update dependencies
- Backup database
- Review analytics

### Scaling
- Upgrade Vercel plan as needed
- Scale Supabase database
- Optimize database queries
- Implement caching strategies

---

**Deployment Checklist**
- [ ] Code pushed to GitHub
- [ ] Supabase database configured
- [ ] Supabase storage buckets created
- [ ] Environment variables set in Vercel
- [ ] Domain configured
- [ ] Deployment successful
- [ ] All features tested
- [ ] Monitoring enabled
- [ ] Alerts configured
- [ ] Team notified
