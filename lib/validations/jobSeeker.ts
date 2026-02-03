/**
 * Job Seeker Form Validations
 * Zod schemas for form validation
 */

import { z } from 'zod'

export const resumeUploadSchema = z.object({
  // Identity & Contact
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  mobile_country_code: z.string().default('+91'),
  whatsapp_consent: z.boolean().default(false),
  full_name: z.string().min(2, 'Full name is required'),
  date_of_birth: z.string().optional(),

  // Location
  current_location: z.object({
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
  }),
  preferred_locations: z.array(z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
  })).default([]),
  willing_to_relocate: z.boolean().default(false),

  // Job Context
  job_code: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  job_types: z.array(z.enum(['full_time', 'part_time', 'contract', 'internship'])).min(1, 'Select at least one job type'),
  work_modes: z.array(z.enum(['remote', 'hybrid', 'onsite'])).min(1, 'Select at least one work mode'),
  notice_period: z.string().optional(),

  // Experience
  total_experience: z.number().min(0, 'Experience cannot be negative'),
  relevant_experience: z.number().optional(),
  career_break: z.boolean().default(false),
  career_break_duration: z.string().optional(),
  employment_gap_explanation: z.string().optional(),

  // Salary
  current_salary: z.object({
    fixed: z.number().min(0),
    variable: z.number().min(0),
    currency: z.string().default('INR'),
  }).optional(),
  preferred_salary: z.object({
    min: z.number().min(0, 'Minimum salary is required'),
    max: z.number().min(0, 'Maximum salary is required'),
    currency: z.string().default('INR'),
  }),

  // Skills
  primary_skill: z.string().min(1, 'Primary skill is required'),
  secondary_skills: z.array(z.string()).default([]),
  licenses_certifications: z.array(z.string()).default([]),

  // Resume
  resume_title: z.string().min(1, 'Resume title is required'),
  cover_letter_text: z.string().optional(),

  // Visibility & Consent
  resume_visibility: z.enum(['public', 'searchable_hidden_contact', 'private']).default('searchable_hidden_contact'),
  terms_consent: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  contact_consent: z.boolean().default(false),
  communication_consent: z.boolean().default(false),
})

export const employmentHistorySchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  joining_date: z.string().min(1, 'Joining date is required'),
  relieving_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
})

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  specialization: z.string().optional(),
  completion_year: z.number().min(1900).max(new Date().getFullYear() + 10),
})

export type ResumeUploadFormData = z.infer<typeof resumeUploadSchema>
export type EmploymentHistoryFormData = z.infer<typeof employmentHistorySchema>
export type EducationFormData = z.infer<typeof educationSchema>
