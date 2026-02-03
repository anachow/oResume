-- ========================================
-- oResume Database Schema
-- Enterprise-grade PostgreSQL schema with RLS
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ========================================
-- ENUMS
-- ========================================

CREATE TYPE user_type AS ENUM ('job_seeker', 'employer', 'recruiter', 'admin');
CREATE TYPE user_status AS ENUM ('visitor', 'free', 'trial', 'paid');
CREATE TYPE subscription_plan AS ENUM ('free', 'trial', 'basic', 'professional', 'enterprise');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE work_mode AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE resume_visibility AS ENUM ('public', 'searchable_hidden_contact', 'private');
CREATE TYPE employer_team_role AS ENUM ('admin', 'recruiter', 'viewer');
CREATE TYPE recruiter_type AS ENUM ('individual', 'agency');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- ========================================
-- CORE TABLES
-- ========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  user_status user_status DEFAULT 'free',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UTM Tracking
CREATE TABLE utm_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_referral_code TEXT,
  utm_country TEXT,
  utm_job_code TEXT,
  first_visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signup_date TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- JOB SEEKER TABLES
-- ========================================

-- Job Seekers
CREATE TABLE job_seekers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  mobile_country_code TEXT NOT NULL,
  whatsapp_consent BOOLEAN DEFAULT FALSE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  current_location JSONB NOT NULL, -- {country, state, city}
  preferred_locations JSONB, -- [{country, state, city}]
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  job_code TEXT,
  industry TEXT NOT NULL,
  job_types job_type[] NOT NULL,
  work_modes work_mode[] NOT NULL,
  notice_period TEXT,
  total_experience INTEGER NOT NULL, -- in months
  relevant_experience INTEGER,
  career_break BOOLEAN DEFAULT FALSE,
  career_break_duration TEXT,
  employment_gap_explanation TEXT,
  current_salary JSONB, -- {fixed, variable, currency}
  preferred_salary JSONB, -- {min, max, currency}
  primary_skill TEXT NOT NULL,
  secondary_skills TEXT[] DEFAULT '{}',
  licenses_certifications TEXT[] DEFAULT '{}',
  resume_visibility resume_visibility DEFAULT 'searchable_hidden_contact',
  terms_consent BOOLEAN DEFAULT FALSE,
  contact_consent BOOLEAN DEFAULT FALSE,
  communication_consent BOOLEAN DEFAULT FALSE,
  profile_completeness INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employment History
CREATE TABLE employment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  joining_date DATE NOT NULL,
  relieving_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  specialization TEXT,
  completion_year INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  cover_letter_text TEXT,
  cover_letter_file_path TEXT,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- EMPLOYER TABLES
-- ========================================

-- Employers
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  hq_location JSONB NOT NULL, -- {country, state, city}
  year_founded INTEGER,
  company_email_domain TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_mobile TEXT NOT NULL,
  primary_contact_designation TEXT,
  primary_contact_linkedin TEXT,
  roles_hired_for TEXT[] DEFAULT '{}',
  hiring_locations TEXT[] DEFAULT '{}',
  hiring_volume TEXT,
  employment_types job_type[] DEFAULT '{}',
  organization_consent BOOLEAN DEFAULT FALSE,
  policies_consent BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employer Team Members
CREATE TABLE employer_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role employer_team_role NOT NULL,
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employer_id, user_id)
);

-- ========================================
-- RECRUITER TABLES
-- ========================================

-- Recruiters
CREATE TABLE recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recruiter_type recruiter_type NOT NULL,
  recruiter_name TEXT NOT NULL,
  agency_name TEXT,
  website TEXT,
  linkedin TEXT,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  mobile_country_code TEXT NOT NULL,
  whatsapp_consent BOOLEAN DEFAULT FALSE,
  location JSONB NOT NULL, -- {country, state, city}
  industries_served TEXT[] DEFAULT '{}',
  roles_hired TEXT[] DEFAULT '{}',
  experience_levels TEXT[] DEFAULT '{}',
  countries_served TEXT[] DEFAULT '{}',
  represents_multiple_employers BOOLEAN DEFAULT FALSE,
  employer_names TEXT[] DEFAULT '{}',
  fair_usage_consent BOOLEAN DEFAULT FALSE,
  data_protection_consent BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SUBSCRIPTION & PAYMENT TABLES
-- ========================================

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL,
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT TRUE,
  credits_remaining INTEGER,
  features JSONB NOT NULL, -- subscription features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SEARCH & ACTIVITY TABLES
-- ========================================

-- Search History
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_filters JSONB NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Views
CREATE TABLE resume_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  view_type TEXT NOT NULL, -- 'preview', 'full_view', 'download'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidate Shortlists
CREATE TABLE candidate_shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_seeker_id)
);

-- ========================================
-- ADMIN TABLES
-- ========================================

-- Admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- super_admin, admin, moderator
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ANALYTICS TABLES
-- ========================================

-- User Analytics
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_views INTEGER DEFAULT 0,
  resume_views INTEGER DEFAULT 0,
  resume_downloads INTEGER DEFAULT 0,
  searches_appeared_in INTEGER DEFAULT 0,
  employer_contacts INTEGER DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Analytics (aggregated daily)
CREATE TABLE platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  total_users INTEGER DEFAULT 0,
  total_job_seekers INTEGER DEFAULT 0,
  total_employers INTEGER DEFAULT 0,
  total_recruiters INTEGER DEFAULT 0,
  total_resumes INTEGER DEFAULT 0,
  total_searches INTEGER DEFAULT 0,
  total_resume_views INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  paid_conversions INTEGER DEFAULT 0,
  trial_conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- REFERENCE DATA TABLES
-- ========================================

-- Job Codes (for autocomplete)
CREATE TABLE job_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills (for autocomplete)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industries (for autocomplete)
CREATE TABLE industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- UTM tracking indexes
CREATE INDEX idx_utm_tracking_user_id ON utm_tracking(user_id);
CREATE INDEX idx_utm_tracking_session_id ON utm_tracking(session_id);
CREATE INDEX idx_utm_tracking_utm_source ON utm_tracking(utm_source);

-- Job seekers indexes
CREATE INDEX idx_job_seekers_user_id ON job_seekers(user_id);
CREATE INDEX idx_job_seekers_email ON job_seekers(email);
CREATE INDEX idx_job_seekers_primary_skill ON job_seekers(primary_skill);
CREATE INDEX idx_job_seekers_industry ON job_seekers(industry);
CREATE INDEX idx_job_seekers_total_experience ON job_seekers(total_experience);
CREATE INDEX idx_job_seekers_resume_visibility ON job_seekers(resume_visibility);
CREATE INDEX idx_job_seekers_created_at ON job_seekers(created_at);

-- Resumes indexes
CREATE INDEX idx_resumes_job_seeker_id ON resumes(job_seeker_id);
CREATE INDEX idx_resumes_is_active ON resumes(is_active);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);

-- Employers indexes
CREATE INDEX idx_employers_user_id ON employers(user_id);
CREATE INDEX idx_employers_company_name ON employers(company_name);
CREATE INDEX idx_employers_is_verified ON employers(is_verified);

-- Recruiters indexes
CREATE INDEX idx_recruiters_user_id ON recruiters(user_id);
CREATE INDEX idx_recruiters_email ON recruiters(email);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- Payments indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_payment_id ON payments(gateway_payment_id);

-- Search history indexes
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Resume views indexes
CREATE INDEX idx_resume_views_resume_id ON resume_views(resume_id);
CREATE INDEX idx_resume_views_viewer_id ON resume_views(viewer_id);
CREATE INDEX idx_resume_views_job_seeker_id ON resume_views(job_seeker_id);
CREATE INDEX idx_resume_views_created_at ON resume_views(created_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Analytics indexes
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_platform_analytics_date ON platform_analytics(date);

-- Skills index for search
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_usage_count ON skills(usage_count);

-- ========================================
-- TRIGGERS
-- ========================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seekers_updated_at BEFORE UPDATE ON job_seekers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employment_history_updated_at BEFORE UPDATE ON employment_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to get user's subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS subscription_status AS $$
DECLARE
  v_status subscription_status;
BEGIN
  SELECT status INTO v_status
  FROM subscriptions
  WHERE user_id = p_user_id;

  RETURN COALESCE(v_status, 'free'::subscription_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature access
CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_features JSONB;
  v_status subscription_status;
BEGIN
  SELECT features, status INTO v_features, v_status
  FROM subscriptions
  WHERE user_id = p_user_id;

  -- Free users have limited access
  IF v_status IS NULL OR v_status = 'free' THEN
    RETURN FALSE;
  END IF;

  -- Check if feature exists in subscription
  RETURN v_features ? p_feature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
