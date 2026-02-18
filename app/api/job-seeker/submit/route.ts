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
    throw new Error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function POST(request: NextRequest) {
  const supabase = getAdminClient()
  let createdAuthUserId: string | null = null

  try {
    const formData = await request.formData()

    // ── Extract all fields ──────────────────────────────────────────────
    const email               = formData.get('email') as string
    const mobile              = formData.get('mobile') as string
    const mobile_country_code = formData.get('mobile_country_code') as string
    const whatsapp_consent    = formData.get('whatsapp_consent') === 'true'
    const full_name           = formData.get('full_name') as string
    const date_of_birth       = (formData.get('date_of_birth') as string) || null
    const current_location    = JSON.parse(formData.get('current_location') as string)
    const preferred_locations = JSON.parse((formData.get('preferred_locations') as string) || '[]')
    const willing_to_relocate = formData.get('willing_to_relocate') === 'true'
    const job_code            = (formData.get('job_code') as string) || null
    const industry            = formData.get('industry') as string
    const job_types           = JSON.parse((formData.get('job_types') as string) || '[]')
    const work_modes          = JSON.parse((formData.get('work_modes') as string) || '[]')
    const notice_period       = (formData.get('notice_period') as string) || null
    const total_experience    = parseInt((formData.get('total_experience') as string) || '0')
    const relevant_experience = formData.get('relevant_experience')
      ? parseInt(formData.get('relevant_experience') as string) : null
    const career_break              = formData.get('career_break') === 'true'
    const career_break_duration     = (formData.get('career_break_duration') as string) || null
    const employment_gap_explanation= (formData.get('employment_gap_explanation') as string) || null
    const current_salary            = formData.get('current_salary')
      ? JSON.parse(formData.get('current_salary') as string) : null
    const preferred_salary    = JSON.parse((formData.get('preferred_salary') as string) || '{}')
    const primary_skill       = formData.get('primary_skill') as string
    const secondary_skills    = JSON.parse((formData.get('secondary_skills') as string) || '[]')
    const licenses_certifications = JSON.parse((formData.get('licenses_certifications') as string) || '[]')
    const resume_title        = formData.get('resume_title') as string
    const cover_letter_text   = (formData.get('cover_letter_text') as string) || null
    const resume_visibility   = (formData.get('resume_visibility') as string) || 'searchable_hidden_contact'
    const terms_consent       = formData.get('terms_consent') === 'true'
    const contact_consent     = formData.get('contact_consent') === 'true'
    const communication_consent = formData.get('communication_consent') === 'true'

    // ── Step 1: Resolve or create the user ─────────────────────────────
    let userId: string
    let isNewUser = false

    // First check our users table
    const { data: existingDbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingDbUser) {
      // Returning user — use existing id
      userId = existingDbUser.id
    } else {
      // Check if orphaned auth user exists (previous failed attempt)
      const { data: authList } = await supabase.auth.admin.listUsers()
      const orphanedAuthUser = authList?.users?.find(u => u.email === email)

      if (orphanedAuthUser) {
        // Auth user exists but our users table row is missing — recreate it
        userId = orphanedAuthUser.id
      } else {
        // Brand new user — create in auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { full_name, user_type: 'job_seeker' },
        })

        if (authError || !authData?.user) {
          return NextResponse.json(
            { error: `Auth error: ${authError?.message || 'createUser returned no user'}` },
            { status: 500 }
          )
        }

        userId = authData.user.id
        createdAuthUserId = userId
      }

      // Insert into our users table
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email,
        user_type: 'job_seeker',
        user_status: 'free',
        email_verified: false,
      })

      if (userError) {
        // Roll back the auth user we just created to avoid orphans
        if (createdAuthUserId) {
          await supabase.auth.admin.deleteUser(createdAuthUserId)
          createdAuthUserId = null
        }
        return NextResponse.json(
          { error: `Database error (users table): ${userError.message}` },
          { status: 500 }
        )
      }

      isNewUser = true
    }

    // ── Step 2: Upsert job_seeker profile ──────────────────────────────
    const profilePayload = {
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
    }

    const { data: upsertedProfile, error: profileError } = await supabase
      .from('job_seekers')
      .upsert(profilePayload, { onConflict: 'user_id' })
      .select('id')
      .single()

    if (profileError || !upsertedProfile) {
      return NextResponse.json(
        { error: `Database error (job_seekers table): ${profileError?.message}` },
        { status: 500 }
      )
    }

    const jobSeekerId = upsertedProfile.id

    // ── Step 3: Resume file upload ─────────────────────────────────────
    const resumeFile = formData.get('resume_file') as File | null
    let resumeFilePath: string | null = null
    let resumeUrl: string | null = null

    if (resumeFile && resumeFile.size > 0) {
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, { contentType: resumeFile.type, upsert: false })

      if (uploadError) {
        console.error('Resume upload error:', uploadError.message)
      } else {
        resumeFilePath = uploadData.path
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(resumeFilePath)
        resumeUrl = urlData.publicUrl

        const { error: resumeMetaError } = await supabase.from('resumes').insert({
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

        if (resumeMetaError) {
          console.error('Resume metadata error:', resumeMetaError.message)
        }
      }
    }

    // ── Step 4: Audit log (best-effort) ────────────────────────────────
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: isNewUser ? 'profile_created' : 'profile_updated',
      resource_type: 'job_seeker',
      resource_id: jobSeekerId,
      details: { resume_uploaded: !!resumeFilePath },
    }).then(() => {})   // ignore failure — audit is non-critical

    return NextResponse.json({
      success: true,
      message: isNewUser
        ? 'Profile created! Check your email to sign in.'
        : 'Profile updated successfully.',
      job_seeker_id: jobSeekerId,
      user_id: userId,
      is_new_user: isNewUser,
    })

  } catch (error: any) {
    // Roll back orphaned auth user on unexpected crash
    if (createdAuthUserId) {
      await supabase.auth.admin.deleteUser(createdAuthUserId).catch(() => {})
    }
    console.error('Unhandled error:', error)
    return NextResponse.json(
      { error: `Server error: ${error?.message || 'Unknown'}` },
      { status: 500 }
    )
  }
}
