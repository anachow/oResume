/**
 * Resume Upload Form Component
 * Comprehensive job seeker registration and resume upload
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeUploadSchema, type ResumeUploadFormData } from '@/lib/validations/jobSeeker'
import { Button, Input, Select, Textarea, Checkbox, FileUpload, Card, CardBody } from '@/components/ui'

export const ResumeUploadForm: React.FC = () => {
  const [step, setStep] = useState(1)
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const [coverLetterFiles, setCoverLetterFiles] = useState<File[]>([])
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResumeUploadFormData>({
    resolver: zodResolver(resumeUploadSchema),
    defaultValues: {
      mobile_country_code: '+91',
      whatsapp_consent: false,
      willing_to_relocate: false,
      career_break: false,
      job_types: [],
      work_modes: [],
      secondary_skills: [],
      licenses_certifications: [],
      preferred_locations: [],
      resume_visibility: 'searchable_hidden_contact',
      terms_consent: false,
      contact_consent: false,
      communication_consent: false,
    },
  })

  const careerBreak = watch('career_break')
  const totalSteps = 6

  const onSubmit = async (data: ResumeUploadFormData) => {
    try {
      setSubmitError(null)

      const formData = new FormData()

      // Append all text fields
      formData.append('email', data.email)
      formData.append('mobile', data.mobile)
      formData.append('mobile_country_code', data.mobile_country_code)
      formData.append('whatsapp_consent', String(data.whatsapp_consent))
      formData.append('full_name', data.full_name)
      if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
      formData.append('current_location', JSON.stringify(data.current_location))
      formData.append('preferred_locations', JSON.stringify(data.preferred_locations || []))
      formData.append('willing_to_relocate', String(data.willing_to_relocate))
      if (data.job_code) formData.append('job_code', data.job_code)
      formData.append('industry', data.industry)
      formData.append('job_types', JSON.stringify(data.job_types))
      formData.append('work_modes', JSON.stringify(data.work_modes))
      if (data.notice_period) formData.append('notice_period', data.notice_period)
      formData.append('total_experience', String(data.total_experience))
      if (data.relevant_experience) formData.append('relevant_experience', String(data.relevant_experience))
      formData.append('career_break', String(data.career_break))
      if (data.career_break_duration) formData.append('career_break_duration', data.career_break_duration)
      if (data.employment_gap_explanation) formData.append('employment_gap_explanation', data.employment_gap_explanation)
      if (data.current_salary) formData.append('current_salary', JSON.stringify(data.current_salary))
      formData.append('preferred_salary', JSON.stringify(data.preferred_salary))
      formData.append('primary_skill', data.primary_skill)
      formData.append('secondary_skills', JSON.stringify(
        typeof data.secondary_skills === 'string'
          ? (data.secondary_skills as string).split(',').map((s: string) => s.trim()).filter(Boolean)
          : data.secondary_skills
      ))
      formData.append('licenses_certifications', JSON.stringify(
        typeof data.licenses_certifications === 'string'
          ? (data.licenses_certifications as string).split(',').map((s: string) => s.trim()).filter(Boolean)
          : data.licenses_certifications
      ))
      formData.append('resume_title', data.resume_title)
      if (data.cover_letter_text) formData.append('cover_letter_text', data.cover_letter_text)
      formData.append('resume_visibility', data.resume_visibility)
      formData.append('terms_consent', String(data.terms_consent))
      formData.append('contact_consent', String(data.contact_consent))
      formData.append('communication_consent', String(data.communication_consent))

      // Append files
      if (resumeFiles[0]) formData.append('resume_file', resumeFiles[0])
      if (coverLetterFiles[0]) formData.append('cover_letter_file', coverLetterFiles[0])

      const response = await fetch('/api/job-seeker/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitError(result.error || 'Submission failed. Please try again.')
        return
      }

      setIsNewUser(result.is_new_user)
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('An unexpected error occurred. Please try again.')
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (submitSuccess) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Profile Submitted!</h2>
            {isNewUser ? (
              <p className="text-text-light mb-6">
                Your profile has been created. Please check your email to verify your account and start getting discovered by employers.
              </p>
            ) : (
              <p className="text-text-light mb-6">
                Your profile has been updated successfully. Employers and recruiters can now find you.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signin" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Sign In to Your Account
              </a>
              <a href="/" className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Submission Failed</p>
          <p className="text-sm mt-1">{submitError}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-text-light">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Step 1: Identity & Contact */}
      {step === 1 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Identity & Contact</h2>

            <div className="space-y-4">
              <Input
                label="Full Name"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="your.email@example.com"
                required
              />

              <div className="grid grid-cols-4 gap-4">
                <Select
                  label="Country Code"
                  {...register('mobile_country_code')}
                  options={[
                    { value: '+91', label: '+91 (India)' },
                    { value: '+1', label: '+1 (US/Canada)' },
                    { value: '+44', label: '+44 (UK)' },
                    { value: '+971', label: '+971 (UAE)' },
                  ]}
                  className="col-span-1"
                />
                <Input
                  label="Mobile Number"
                  {...register('mobile')}
                  error={errors.mobile?.message}
                  placeholder="1234567890"
                  className="col-span-3"
                  required
                />
              </div>

              <Checkbox
                label="I consent to receive WhatsApp job alerts"
                {...register('whatsapp_consent')}
              />

              <Input
                label="Date of Birth"
                type="date"
                {...register('date_of_birth')}
                error={errors.date_of_birth?.message}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Location</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Country"
                  {...register('current_location.country')}
                  error={errors.current_location?.country?.message}
                  placeholder="India"
                  required
                />
                <Input
                  label="State"
                  {...register('current_location.state')}
                  error={errors.current_location?.state?.message}
                  placeholder="Maharashtra"
                  required
                />
                <Input
                  label="City"
                  {...register('current_location.city')}
                  error={errors.current_location?.city?.message}
                  placeholder="Mumbai"
                  required
                />
              </div>

              <Checkbox
                label="I am willing to relocate"
                {...register('willing_to_relocate')}
              />

              {/* TODO: Add dynamic preferred locations */}
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 3: Job Context & Experience */}
      {step === 3 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Job Context & Experience</h2>

            <div className="space-y-4">
              <Input
                label="Job Code (Optional)"
                {...register('job_code')}
                error={errors.job_code?.message}
                placeholder="e.g., JC12345"
                helpText="Will be auto-filled from UTM if available"
              />

              <Input
                label="Industry"
                {...register('industry')}
                error={errors.industry?.message}
                placeholder="e.g., Information Technology"
                required
              />

              <div>
                <label className="text-sm font-medium text-text block mb-2">
                  Job Types <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <Checkbox label="Full-time" value="full_time" {...register('job_types')} />
                  <Checkbox label="Part-time" value="part_time" {...register('job_types')} />
                  <Checkbox label="Contract" value="contract" {...register('job_types')} />
                  <Checkbox label="Internship" value="internship" {...register('job_types')} />
                </div>
                {errors.job_types && (
                  <p className="text-sm text-red-600 mt-1">{errors.job_types.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-text block mb-2">
                  Work Modes <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <Checkbox label="Remote" value="remote" {...register('work_modes')} />
                  <Checkbox label="Hybrid" value="hybrid" {...register('work_modes')} />
                  <Checkbox label="Onsite" value="onsite" {...register('work_modes')} />
                </div>
                {errors.work_modes && (
                  <p className="text-sm text-red-600 mt-1">{errors.work_modes.message}</p>
                )}
              </div>

              <Input
                label="Total Years of Experience"
                type="number"
                {...register('total_experience', { valueAsNumber: true })}
                error={errors.total_experience?.message}
                placeholder="5"
                required
              />

              <Input
                label="Notice Period"
                {...register('notice_period')}
                error={errors.notice_period?.message}
                placeholder="e.g., 30 days, Immediate"
              />

              <Checkbox
                label="I have taken a career break"
                {...register('career_break')}
              />

              {careerBreak && (
                <>
                  <Input
                    label="Career Break Duration"
                    {...register('career_break_duration')}
                    error={errors.career_break_duration?.message}
                    placeholder="e.g., 6 months"
                  />
                  <Textarea
                    label="Employment Gap Explanation"
                    {...register('employment_gap_explanation')}
                    error={errors.employment_gap_explanation?.message}
                    placeholder="Optional explanation"
                    rows={3}
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 4: Salary & Skills */}
      {step === 4 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Salary & Skills</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preferred Minimum Salary"
                  type="number"
                  {...register('preferred_salary.min', { valueAsNumber: true })}
                  error={errors.preferred_salary?.min?.message}
                  placeholder="500000"
                  required
                />
                <Input
                  label="Preferred Maximum Salary"
                  type="number"
                  {...register('preferred_salary.max', { valueAsNumber: true })}
                  error={errors.preferred_salary?.max?.message}
                  placeholder="800000"
                  required
                />
              </div>

              <Input
                label="Primary Skill"
                {...register('primary_skill')}
                error={errors.primary_skill?.message}
                placeholder="e.g., Full Stack Development"
                required
              />

              <Textarea
                label="Secondary Skills (comma-separated)"
                {...register('secondary_skills')}
                error={errors.secondary_skills?.message}
                placeholder="e.g., React, Node.js, TypeScript, AWS"
                rows={3}
                helpText="Enter your top 3-5 secondary skills"
              />

              <Textarea
                label="Licenses & Certifications (comma-separated)"
                {...register('licenses_certifications')}
                error={errors.licenses_certifications?.message}
                placeholder="e.g., AWS Certified, PMP, Driver's License"
                rows={2}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 5: Resume & Cover Letter */}
      {step === 5 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Resume & Cover Letter</h2>

            <div className="space-y-4">
              <Input
                label="Resume Title"
                {...register('resume_title')}
                error={errors.resume_title?.message}
                placeholder="e.g., Senior Software Engineer - 5 Years Experience"
                required
              />

              <FileUpload
                label="Upload Resume"
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                }}
                maxSize={5 * 1024 * 1024}
                maxFiles={1}
                value={resumeFiles}
                onFilesChange={setResumeFiles}
              />

              <Textarea
                label="Cover Letter (Optional)"
                {...register('cover_letter_text')}
                error={errors.cover_letter_text?.message}
                placeholder="Write a brief cover letter or upload a file below"
                rows={6}
              />

              <FileUpload
                label="Upload Cover Letter (Optional)"
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                }}
                maxSize={5 * 1024 * 1024}
                maxFiles={1}
                value={coverLetterFiles}
                onFilesChange={setCoverLetterFiles}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 6: Visibility & Consent */}
      {step === 6 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-primary mb-6">Visibility & Consent</h2>

            <div className="space-y-4">
              <Select
                label="Resume Visibility"
                {...register('resume_visibility')}
                options={[
                  { value: 'public', label: 'Public & Searchable' },
                  { value: 'searchable_hidden_contact', label: 'Searchable with Hidden Contact Details' },
                  { value: 'private', label: 'Private' },
                ]}
                helpText="Choose how your resume will be visible to employers"
              />

              <div className="space-y-3 pt-4">
                <Checkbox
                  label={
                    <>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-primary hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{' '}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  {...register('terms_consent')}
                  error={errors.terms_consent?.message}
                />

                <Checkbox
                  label="I allow employers and recruiters to contact me"
                  {...register('contact_consent')}
                />

                <Checkbox
                  label="I consent to receive job alerts and updates via email/WhatsApp"
                  {...register('communication_consent')}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button
                type="submit"
                variant="accent"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Resume
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </form>
  )
}
