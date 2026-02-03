-- ========================================
-- oResume Row Level Security (RLS) Policies
-- Enterprise-grade security with least-privilege access
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

-- ========================================
-- HELPER FUNCTIONS FOR RLS
-- ========================================

-- Check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user owns record
CREATE OR REPLACE FUNCTION is_owner(record_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = record_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is employer team member
CREATE OR REPLACE FUNCTION is_employer_team_member(employer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM employer_team_members
    WHERE employer_id = employer_id
    AND user_id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = auth.uid()
    AND status IN ('active', 'trial')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- New users can insert their record (during signup)
CREATE POLICY "Users can insert own record"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ========================================
-- UTM TRACKING POLICIES
-- ========================================

-- Anyone can insert UTM tracking (for visitors)
CREATE POLICY "Anyone can insert UTM tracking"
  ON utm_tracking FOR INSERT
  WITH CHECK (true);

-- Users can view their own UTM data
CREATE POLICY "Users can view own UTM data"
  ON utm_tracking FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Admins can view all UTM data
CREATE POLICY "Admins can view all UTM data"
  ON utm_tracking FOR SELECT
  USING (is_admin());

-- ========================================
-- JOB SEEKERS POLICIES
-- ========================================

-- Job seekers can view their own profile
CREATE POLICY "Job seekers can view own profile"
  ON job_seekers FOR SELECT
  USING (user_id = auth.uid());

-- Job seekers can insert their profile
CREATE POLICY "Job seekers can insert own profile"
  ON job_seekers FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Job seekers can update their own profile
CREATE POLICY "Job seekers can update own profile"
  ON job_seekers FOR UPDATE
  USING (user_id = auth.uid());

-- Employers/Recruiters can view public/searchable profiles
CREATE POLICY "Employers can view searchable profiles"
  ON job_seekers FOR SELECT
  USING (
    resume_visibility IN ('public', 'searchable_hidden_contact')
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type IN ('employer', 'recruiter')
    )
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all job seeker profiles"
  ON job_seekers FOR SELECT
  USING (is_admin());

-- ========================================
-- EMPLOYMENT HISTORY POLICIES
-- ========================================

CREATE POLICY "Job seekers can manage own employment history"
  ON employment_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = employment_history.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view employment history of searchable profiles"
  ON employment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = employment_history.job_seeker_id
      AND resume_visibility IN ('public', 'searchable_hidden_contact')
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type IN ('employer', 'recruiter')
    )
  );

-- ========================================
-- EDUCATION POLICIES
-- ========================================

CREATE POLICY "Job seekers can manage own education"
  ON education FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = education.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view education of searchable profiles"
  ON education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = education.job_seeker_id
      AND resume_visibility IN ('public', 'searchable_hidden_contact')
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type IN ('employer', 'recruiter')
    )
  );

-- ========================================
-- RESUMES POLICIES
-- ========================================

CREATE POLICY "Job seekers can manage own resumes"
  ON resumes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = resumes.job_seeker_id
      AND user_id = auth.uid()
    )
  );

-- Employers/Recruiters can view resumes based on visibility and subscription
CREATE POLICY "Employers can view resumes with subscription"
  ON resumes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers js
      WHERE js.id = resumes.job_seeker_id
      AND js.resume_visibility IN ('public', 'searchable_hidden_contact')
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type IN ('employer', 'recruiter')
    )
    AND has_active_subscription()
  );

-- ========================================
-- EMPLOYERS POLICIES
-- ========================================

CREATE POLICY "Employers can view own profile"
  ON employers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Employers can insert own profile"
  ON employers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can update own profile"
  ON employers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all employers"
  ON employers FOR SELECT
  USING (is_admin());

-- ========================================
-- EMPLOYER TEAM MEMBERS POLICIES
-- ========================================

CREATE POLICY "Employer admins can manage team"
  ON employer_team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM employer_team_members etm
      WHERE etm.employer_id = employer_team_members.employer_id
      AND etm.user_id = auth.uid()
      AND etm.role = 'admin'
      AND etm.is_active = TRUE
    )
  );

CREATE POLICY "Team members can view own record"
  ON employer_team_members FOR SELECT
  USING (user_id = auth.uid());

-- ========================================
-- RECRUITERS POLICIES
-- ========================================

CREATE POLICY "Recruiters can view own profile"
  ON recruiters FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Recruiters can insert own profile"
  ON recruiters FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recruiters can update own profile"
  ON recruiters FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all recruiters"
  ON recruiters FOR SELECT
  USING (is_admin());

-- ========================================
-- SUBSCRIPTIONS POLICIES
-- ========================================

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (is_admin());

-- ========================================
-- PAYMENTS POLICIES
-- ========================================

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (is_admin());

-- ========================================
-- SEARCH HISTORY POLICIES
-- ========================================

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert search history"
  ON search_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all search history"
  ON search_history FOR SELECT
  USING (is_admin());

-- ========================================
-- RESUME VIEWS POLICIES
-- ========================================

CREATE POLICY "Viewers can insert resume views"
  ON resume_views FOR INSERT
  WITH CHECK (viewer_id = auth.uid());

CREATE POLICY "Job seekers can view who viewed their resume"
  ON resume_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = resume_views.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Viewers can see their own views"
  ON resume_views FOR SELECT
  USING (viewer_id = auth.uid());

CREATE POLICY "Admins can view all resume views"
  ON resume_views FOR SELECT
  USING (is_admin());

-- ========================================
-- CANDIDATE SHORTLISTS POLICIES
-- ========================================

CREATE POLICY "Users can manage own shortlists"
  ON candidate_shortlists FOR ALL
  USING (user_id = auth.uid());

-- ========================================
-- ADMINS POLICIES
-- ========================================

CREATE POLICY "Admins can view all admin records"
  ON admins FOR SELECT
  USING (is_admin());

CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- ========================================
-- AUDIT LOGS POLICIES
-- ========================================

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- Anyone authenticated can insert audit logs (via function)
CREATE POLICY "Authenticated users can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (is_authenticated());

-- ========================================
-- ANALYTICS POLICIES
-- ========================================

CREATE POLICY "Users can view own analytics"
  ON user_analytics FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user analytics"
  ON user_analytics FOR SELECT
  USING (is_admin());

CREATE POLICY "Only admins can view platform analytics"
  ON platform_analytics FOR SELECT
  USING (is_admin());

-- ========================================
-- REFERENCE DATA POLICIES
-- ========================================

-- Job codes: Read-only for all, admins can manage
CREATE POLICY "Anyone can view active job codes"
  ON job_codes FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admins can manage job codes"
  ON job_codes FOR ALL
  USING (is_admin());

-- Skills: Read-only for all, admins can manage
CREATE POLICY "Anyone can view active skills"
  ON skills FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admins can manage skills"
  ON skills FOR ALL
  USING (is_admin());

-- Industries: Read-only for all, admins can manage
CREATE POLICY "Anyone can view active industries"
  ON industries FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admins can manage industries"
  ON industries FOR ALL
  USING (is_admin());

-- ========================================
-- STORAGE POLICIES (Supabase Storage)
-- ========================================

-- Note: These policies are applied directly in Supabase Storage interface
-- Documented here for reference:
--
-- Bucket: resumes
-- - Job seekers can upload their own resumes
-- - Employers/Recruiters with active subscription can download resumes
-- - Admins have full access
--
-- Bucket: cover-letters
-- - Job seekers can upload their own cover letters
-- - Employers/Recruiters with active subscription can download
-- - Admins have full access
--
-- Bucket: employer-logos
-- - Employers can upload their company logos
-- - Public read access
--
-- Bucket: profile-pictures
-- - Users can upload their own profile pictures
-- - Public read access based on profile visibility
