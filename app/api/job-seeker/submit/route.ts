/**
 * API Route: Submit Job Seeker Profile
 * POST /api/job-seeker/submit
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient()
    const formData = await request.formData()

    // Extract all form fields
    const email = formData.get('email') as string
    const mobile = formData.get('mobile') as string
    const mobile_country_code = formData.get('mobile_country_code') as string
    const whatsapp_consent = formData.get('whatsapp_consent') === 'true'
    const full_name = formData.get('full_name') as string
    const date_of_birth = formData.get('date_of_birth') as string || null
    const current_location = JSON.parse(formData.get('current_location') as string)
    const preferred_locations = JSON.parse(formData.get('preferred_locations') as string || '[]')
    const willing_to_relocate = formData.get('willing_to_relocate') === 'true'
    const job_code = formData.get('job_code') as string || null
    const industry = formData.get('industry') as string
    const job_types = JSON.parse(formData.get('job_types') as string || '[]')
    const work_modes = JSON.parse(formData.get('work_modes') as string || '[]')
    const notice_period = formData.get('notice_period') as string || null
    const total_experience = parseInt(formData.get('total_experience') as string || '0')
    const relevant_experience = formData.get('relevant_experience') ? parseInt(formData.get('relevant_experience') as string) : null
    const career_break = formData.get('career_break') === 'true'
    const career_break_duration = formData.get('career_break_duration') as string || null
    const employment_gap_explanation = formData.get('employment_gap_explanation') as string || null
    const current_salary = formData.get('current_salary') ? JSON.parse(formData.get('current_salary') as string) : null
    const preferred_salary = JSON.parse(formData.get('preferred_salary') as string || '{}')
    const primary_skill = formData.get('primary_skill') as string
    const secondary_skills = JSON.parse(formData.get('secondary_skills') as string || '[]')
    const licenses_certifications = JSON.parse(formData.get('licenses_certifications') as string || '[]')
    const resume_title = formData.get('resume_title') as string
    const cover_letter_text = formData.get('cover_letter_text') as string || null
    const resume_visibility = formData.get('resume_visibility') as string || 'searchable_hidden_contact'
    const terms_consent = formData.get('terms_consent') === 'true'
    const contact_consent = formData.get('contact_consent') === 'true'
    const communication_consent = formData.get('communication_consent') === 'true'

    // Step 1: Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: { full_name, user_type: 'job_seeker' }
      })

      if (authError || !authData.user) {
        console.error('Auth createUser error:', authError)
        return NextResponse.json(
          { error: `Failed to create user account: ${authError?.message || 'Unknown auth error'}` },
          { status: 500 }
        )
      }

      userId = authData.user.id

      // Insert into users table
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email,
        user_type: 'job_seeker',
        user_status: 'free',
        email_verified: false,
      })

      if (userError) {
        return NextResponse.json(
          { error: 'Failed to create user record', details: userError.message },
          { status: 500 }
        )
      }
    }

    // Step 2: Check if job_seeker profile already exists
    const { data: existingProfile } = await supabase
      .from('job_seekers')
      .select('id')
      .eq('user_id', userId)
      .single()

    let jobSeekerId: string

    if (existingProfile) {
      jobSeekerId = existingProfile.id
      // Update existing profile
      await supabase.from('job_seekers').update({
        mobile,
        mobile_country_code,
        whatsapp_consent,
        full_name,
        date_of_birth: date_of_birth || null,
        current_location,
        preferred_locations,
        willing_to_relocate,
        job_code,
        industry,
        job_types,
        work_modes,
        notice_period,
        total_experience,
        relevant_experience,
        career_break,
        career_break_duration,
        employment_gap_explanation,
        current_salary,
        preferred_salary,
        primary_skill,
        secondary_skills,
        licenses_certifications,
        resume_visibility,
        terms_consent,
        contact_consent,
        communication_consent,
        updated_at: new Date().toISOString(),
      }).eq('id', jobSeekerId)
    } else {
      // Create new job seeker profile
      const { data: newProfile, error: profileError } = await supabase
        .from('job_seekers')
        .insert({
          user_id: userId,
          email,
          mobile,
          mobile_country_code,
          whatsapp_consent,
          full_name,
          date_of_birth: date_of_birth || null,
          current_location,
          preferred_locations,
          willing_to_relocate,
          job_code,
          industry,
          job_types,
          work_modes,
          notice_period,
          total_experience,
          relevant_experience,
          career_break,
          career_break_duration,
          employment_gap_explanation,
          current_salary,
          preferred_salary,
          primary_skill,
          secondary_skills,
          licenses_certifications,
          resume_visibility,
          terms_consent,
          contact_consent,
          communication_consent,
        })
        .select('id')
        .single()

      if (profileError || !newProfile) {
        return NextResponse.json(
          { error: 'Failed to create job seeker profile', details: profileError?.message },
          { status: 500 }
        )
      }

      jobSeekerId = newProfile.id
    }

    // Step 3: Handle resume file upload
    const resumeFile = formData.get('resume_file') as File | null
    let resumeUrl = null
    let resumeFilePath = null

    if (resumeFile && resumeFile.size > 0) {
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          contentType: resumeFile.type,
          upsert: false,
        })

      if (uploadError) {
        // Log but don't fail - resume upload failure shouldn't block profile creation
        console.error('Resume upload error:', uploadError)
      } else {
        resumeFilePath = uploadData.path
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(resumeFilePath)
        resumeUrl = urlData.publicUrl
      }

      // Save resume metadata
      if (resumeFilePath) {
        const { error: resumeError } = await supabase.from('resumes').insert({
          job_seeker_id: jobSeekerId,
          title: resume_title,
          file_path: resumeFilePath,
          file_url: resumeUrl,
          file_name: resumeFile.name,
          file_size: resumeFile.size,
          file_type: resumeFile.type,
          version: 1,
          is_active: true,
          cover_letter_text,
        })

        if (resumeError) {
          console.error('Resume metadata save error:', resumeError)
        }
      }
    }

    // Step 4: Log audit event
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: existingProfile ? 'profile_updated' : 'profile_created',
      resource_type: 'job_seeker',
      resource_id: jobSeekerId,
      details: { resume_uploaded: !!resumeFilePath },
    })

    // Step 5: Send magic link email for sign-in (passwordless auth)
    if (!existingUser) {
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
      })
    }

    return NextResponse.json({
      success: true,
      message: existingProfile
        ? 'Your profile has been updated successfully!'
        : 'Your profile has been created! Check your email to verify your account.',
      job_seeker_id: jobSeekerId,
      user_id: userId,
      is_new_user: !existingUser,
    })

  } catch (error: any) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
