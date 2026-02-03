/**
 * Core type definitions for oResume platform
 */

// ============================================
// User Types
// ============================================

export type UserType = 'job_seeker' | 'employer' | 'recruiter' | 'admin'

export type UserStatus = 'visitor' | 'free' | 'trial' | 'paid'

export type SubscriptionPlan = 'free' | 'trial' | 'basic' | 'professional' | 'enterprise'

// ============================================
// Job Seeker Types
// ============================================

export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship'

export type WorkMode = 'remote' | 'hybrid' | 'onsite'

export type ResumeVisibility = 'public' | 'searchable_hidden_contact' | 'private'

export interface JobSeeker {
  id: string
  user_id: string
  email: string
  mobile: string
  mobile_country_code: string
  whatsapp_consent: boolean
  full_name: string
  date_of_birth: string
  current_location: {
    country: string
    state: string
    city: string
  }
  preferred_locations: Array<{
    country: string
    state: string
    city: string
  }>
  willing_to_relocate: boolean
  job_code?: string
  industry: string
  job_types: JobType[]
  work_modes: WorkMode[]
  notice_period: string
  total_experience: number
  relevant_experience?: number
  career_break: boolean
  career_break_duration?: string
  employment_gap_explanation?: string
  current_salary: {
    fixed: number
    variable: number
    currency: string
  }
  preferred_salary: {
    min: number
    max: number
    currency: string
  }
  primary_skill: string
  secondary_skills: string[]
  licenses_certifications: string[]
  resume_visibility: ResumeVisibility
  terms_consent: boolean
  contact_consent: boolean
  communication_consent: boolean
  created_at: string
  updated_at: string
}

export interface EmploymentHistory {
  id: string
  job_seeker_id: string
  company: string
  role: string
  joining_date: string
  relieving_date?: string
  is_current: boolean
  order: number
  created_at: string
}

export interface Education {
  id: string
  job_seeker_id: string
  institution: string
  degree: string
  specialization: string
  completion_year: number
  order: number
  created_at: string
}

export interface Resume {
  id: string
  job_seeker_id: string
  title: string
  file_path: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  version: number
  is_active: boolean
  cover_letter_text?: string
  cover_letter_file_path?: string
  created_at: string
  updated_at: string
}

// ============================================
// Employer Types
// ============================================

export type EmployerTeamRole = 'admin' | 'recruiter' | 'viewer'

export interface Employer {
  id: string
  user_id: string
  company_name: string
  website: string
  industry: string
  company_size: string
  hq_location: {
    country: string
    state: string
    city: string
  }
  year_founded?: number
  company_email_domain: string
  primary_contact_name: string
  primary_contact_email: string
  primary_contact_mobile: string
  primary_contact_designation: string
  primary_contact_linkedin?: string
  roles_hired_for: string[]
  hiring_locations: string[]
  hiring_volume: string
  employment_types: JobType[]
  organization_consent: boolean
  policies_consent: boolean
  created_at: string
  updated_at: string
}

export interface EmployerTeamMember {
  id: string
  employer_id: string
  user_id: string
  email: string
  name: string
  role: EmployerTeamRole
  invited_by: string
  invited_at: string
  accepted_at?: string
  is_active: boolean
}

// ============================================
// Recruiter Types
// ============================================

export type RecruiterType = 'individual' | 'agency'

export interface Recruiter {
  id: string
  user_id: string
  recruiter_type: RecruiterType
  recruiter_name: string
  agency_name?: string
  website?: string
  linkedin?: string
  email: string
  mobile: string
  mobile_country_code: string
  whatsapp_consent: boolean
  location: {
    country: string
    state: string
    city: string
  }
  industries_served: string[]
  roles_hired: string[]
  experience_levels: string[]
  countries_served: string[]
  represents_multiple_employers: boolean
  employer_names?: string[]
  fair_usage_consent: boolean
  data_protection_consent: boolean
  created_at: string
  updated_at: string
}

// ============================================
// Subscription & Payment Types
// ============================================

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  trial_start_date?: string
  trial_end_date?: string
  subscription_start_date: string
  subscription_end_date?: string
  auto_renew: boolean
  credits_remaining?: number
  features: SubscriptionFeatures
  created_at: string
  updated_at: string
}

export interface SubscriptionFeatures {
  candidate_searches_per_month: number | 'unlimited'
  resume_views_per_month: number | 'unlimited'
  resume_downloads_per_month: number | 'unlimited'
  contact_reveals_per_month: number | 'unlimited'
  ai_matching_credits: number | 'unlimited'
  data_exports: boolean
  priority_support: boolean
  analytics_access: boolean
}

export interface Payment {
  id: string
  user_id: string
  subscription_id?: string
  amount: number
  currency: string
  payment_gateway: 'razorpay'
  gateway_payment_id: string
  gateway_order_id: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  created_at: string
}

// ============================================
// UTM Tracking Types
// ============================================

export interface UTMTracking {
  id: string
  user_id?: string
  utm_source?: string
  utm_campaign?: string
  utm_referral_code?: string
  utm_country?: string
  utm_job_code?: string
  first_visit_date: string
  signup_date?: string
  created_at: string
}

// ============================================
// Search & Matching Types
// ============================================

export interface SearchFilters {
  keywords?: string
  skills?: string[]
  experience_min?: number
  experience_max?: number
  location?: {
    country?: string
    state?: string
    city?: string
  }
  job_types?: JobType[]
  work_modes?: WorkMode[]
  industries?: string[]
  salary_min?: number
  salary_max?: number
  notice_period?: string[]
}

export interface SearchResult {
  job_seeker_id: string
  relevance_score: number
  match_reason: string[]
  resume_id: string
}

// ============================================
// Admin Types
// ============================================

export interface Admin {
  id: string
  user_id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// ============================================
// Analytics Types
// ============================================

export interface PlatformAnalytics {
  total_users: number
  total_job_seekers: number
  total_employers: number
  total_recruiters: number
  total_resumes: number
  total_searches: number
  total_resume_views: number
  total_downloads: number
  paid_conversions: number
  trial_conversions: number
  date_range: {
    from: string
    to: string
  }
}

export interface UserAnalytics {
  user_id: string
  profile_views: number
  resume_views: number
  resume_downloads: number
  searches_appeared_in: number
  employer_contacts: number
  date_range: {
    from: string
    to: string
  }
}

// ============================================
// Database Response Types
// ============================================

export interface DatabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  page_size: number
  total_pages: number
}
