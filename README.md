# oResume - Enterprise Job Search & Resume Platform

> Enterprise-grade job search and resume repository platform connecting job seekers with employers and recruiters.

## Overview

oResume is a modern, secure, and scalable platform designed for:
- **Job Seekers**: Upload resumes, manage profiles, and get discovered by top employers
- **Employers**: Search candidates, manage hiring teams, and streamline recruitment
- **Recruiters**: Access talent pool and connect candidates with opportunities

## Features

### For Job Seekers
- ✅ Comprehensive resume upload with profile management
- ✅ Privacy controls for profile visibility
- ✅ AI-powered job matching
- ✅ Track profile views and employer contacts
- ✅ Multiple resume versions support

### For Employers
- ✅ Advanced candidate search with filters
- ✅ Team collaboration with role-based access
- ✅ Resume viewing and downloading
- ✅ Analytics and hiring metrics
- ✅ Subscription-based access control

### For Recruiters
- ✅ Access to verified candidate database
- ✅ Multi-employer representation support
- ✅ Search and matching capabilities
- ✅ Subscription management

### Platform Features
- 🔒 **Enterprise Security**: Row-level security, role-based access, audit logging
- 🚀 **Scalable Architecture**: Built for high concurrency and growth
- 🎨 **Premium Design**: Modern, professional UI with accessibility
- 🤖 **AI-Powered**: OpenAI integration for semantic search and matching
- 📊 **Analytics**: Comprehensive tracking and reporting
- 💳 **Payment Integration**: Razorpay for subscriptions

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage Buckets
- **API**: Next.js API Routes

### Integrations
- **AI/ML**: OpenAI API for semantic search and matching
- **Payments**: Razorpay
- **Vector Search**: pgvector extension
- **Analytics**: Custom analytics system

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automatic deployment from GitHub
- **Environment**: Serverless

## Project Structure

```
oResume/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── upload/                  # Resume upload pages
│   ├── employers/               # Employer pages
│   └── recruiters/              # Recruiter pages
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── forms/                   # Form components
│   └── layout/                  # Layout components
├── lib/                         # Core libraries
│   ├── supabase.ts             # Supabase client
│   ├── auth.ts                 # Authentication utilities
│   └── validations/            # Form validation schemas
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
├── database/                    # Database schema and migrations
│   ├── schema.sql              # Database schema
│   └── rls_policies.sql        # Row Level Security policies
└── public/                      # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Supabase account
- OpenAI API key
- Razorpay account (for payments)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd oResume
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Redis (Optional)
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

4. **Set up the database**

Run the SQL scripts in your Supabase SQL Editor:
- First, execute `database/schema.sql`
- Then, execute `database/rls_policies.sql`

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel
4. Deploy

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the schema SQL: `database/schema.sql`
3. Apply RLS policies: `database/rls_policies.sql`
4. Create storage buckets:
   - `resumes` (private)
   - `cover-letters` (private)
   - `employer-logos` (public)
   - `profile-pictures` (public)

### Storage Bucket Policies

Configure bucket policies in Supabase Storage:

**Resumes Bucket:**
- Job seekers can upload their own resumes
- Employers/Recruiters with active subscription can download
- Admins have full access

**Cover Letters Bucket:**
- Job seekers can upload their own cover letters
- Employers/Recruiters with active subscription can download

## Security

### Critical Security Practices

1. **Never commit secrets**
   - All secrets in Vercel environment variables
   - `.env` files are gitignored
   - No hardcoded credentials

2. **Row Level Security (RLS)**
   - Enabled on all tables
   - User can only access own data
   - Role-based access for employers/recruiters
   - Admin bypass for platform management

3. **Authentication**
   - Email verification required
   - Session management via Supabase Auth
   - Secure token handling

4. **Audit Logging**
   - All sensitive actions logged
   - User ID, action, timestamp tracked
   - Compliance ready

## API Routes (To be implemented)

- `/api/auth/*` - Authentication endpoints
- `/api/upload` - Resume upload handler
- `/api/search` - Candidate search
- `/api/payments/*` - Payment processing
- `/api/admin/*` - Admin operations

## Features Roadmap

### Phase 1 (Current) - MVP
- [x] Database schema and RLS policies
- [x] UI component library
- [x] Resume upload form
- [ ] Employer enrollment form
- [ ] Recruiter enrollment form
- [ ] Authentication flow
- [ ] File upload to Supabase Storage

### Phase 2 - Core Features
- [ ] Candidate search with filters
- [ ] OpenAI integration for AI matching
- [ ] Subscription system
- [ ] Razorpay payment integration
- [ ] Email notifications
- [ ] UTM tracking

### Phase 3 - Advanced Features
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Team management for employers
- [ ] Resume versioning
- [ ] Advanced search filters
- [ ] Export functionality

### Phase 4 - Enhancements
- [ ] Mobile app
- [ ] Video resume support
- [ ] Interview scheduling
- [ ] Chat system
- [ ] Recommendation engine
- [ ] API for integrations

## Contributing

This is a private enterprise project. Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved

## Support

For support and queries:
- Email: support@oresume.com
- Documentation: [Link to docs]
- GitHub Issues: [Link to issues]

---

Built with ❤️ using Next.js, Supabase, and modern web technologies
