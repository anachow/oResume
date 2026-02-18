/**
 * API Route: Submit Candidate (Job Seeker) Profile
 * POST /api/job-seeker/submit
 *
 * Maps to actual Supabase schema:
 *   users(id, email, mobile, role, subscription)
 *   candidates(user_id, full_name, dob, country, state, city,
 *              current_location, preferred_locations, willing_to_relocate,
 *              total_experience, relevant_experience, notice_period,
 *              job_type, work_mode, industry, current_salary,
 *              preferred_salary, visibility, profile_completed)
 *   skills(id, name)
 *   candidate_skills(candidate_id, skill_id, is_primary)
 *   resumes(id, candidate_id, title, file_path, file_type, file_size, version)
 *   analytics_events(user_id, event_type, metadata)
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

    // ── Extract form fields ──────────────────────────────────────────────
    const email            = formData.get('email') as string
    const mobile           = (formData.get('mobile') as string) || null
    const full_name        = formData.get('full_name') as string
    const date_of_birth    = (formData.get('date_of_birth') as string) || null

    // current_location arrives as JSON { city, state, country }
    const currentLocationRaw = (formData.get('current_location') as string) || '{}'
    let loc: { city?: string; state?: string; country?: string } = {}
    try { loc = JSON.parse(currentLocationRaw) } catch { /* ignore */ }

    const preferred_locations = JSON.parse((formData.get('preferred_locations') as string) || '[]')
    const willing_to_relocate = formData.get('willing_to_relocate') === 'true'
    const industry            = (formData.get('industry') as string) || null
    const job_types           = JSON.parse((formData.get('job_types') as string) || '[]')
    const work_modes          = JSON.parse((formData.get('work_modes') as string) || '[]')
    const notice_period       = (formData.get('notice_period') as string) || null
    const total_experience    = parseFloat((formData.get('total_experience') as string) || '0')
    const relevant_experience = formData.get('relevant_experience')
      ? parseFloat(formData.get('relevant_experience') as string) : null

    // Salary: form may send JSON ({ min, max, currency }) or plain number — store as numeric
    const current_salary  = parseSalaryToNumber(formData.get('current_salary') as string | null)
    const preferred_salary = parseSalaryToNumber(formData.get('preferred_salary') as string | null)

    const primary_skill    = (formData.get('primary_skill') as string) || null
    const secondary_skills = JSON.parse((formData.get('secondary_skills') as string) || '[]') as string[]
    const resume_title     = (formData.get('resume_title') as string) || null
    const resume_visibility = (formData.get('resume_visibility') as string) || 'public'

    // ── Step 1: Resolve or create the user ─────────────────────────────
    let userId: string
    let isNewUser = false

    const { data: existingDbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingDbUser) {
      // Returning user
      userId = existingDbUser.id
      if (mobile) {
        await supabase.from('users').update({ mobile }).eq('id', userId)
      }
    } else {
      // Check for orphaned auth user from a previous failed attempt
      const { data: authList } = await supabase.auth.admin.listUsers()
      const orphanedAuthUser = authList?.users?.find(u => u.email === email)

      if (orphanedAuthUser) {
        userId = orphanedAuthUser.id
      } else {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { full_name, role: 'candidate' },
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

      // Insert into users table (role enum: 'candidate' | 'employer' | 'recruiter' | 'admin')
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email,
        mobile,
        role: 'candidate',
        // subscription defaults to 'free' in DB
      })

      if (userError) {
        if (createdAuthUserId) {
          await supabase.auth.admin.deleteUser(createdAuthUserId)
          createdAuthUserId = null
        }
        return NextResponse.json(
          { error: `Database error (users): ${userError.message}` },
          { status: 500 }
        )
      }

      isNewUser = true
    }

    // ── Step 2: Upsert candidate profile ───────────────────────────────
    // Map form visibility value to DB enum value (default 'public')
    const visibility = mapVisibility(resume_visibility)

    const { error: candidateError } = await supabase
      .from('candidates')
      .upsert({
        user_id:           userId,
        full_name,
        dob:               date_of_birth || null,
        country:           loc.country || null,
        state:             loc.state || null,
        city:              loc.city || null,
        current_location:  currentLocationRaw,
        preferred_locations,
        willing_to_relocate,
        total_experience,
        relevant_experience,
        notice_period,
        job_type:          job_types,
        work_mode:         work_modes,
        industry,
        current_salary,
        preferred_salary,
        visibility,
        profile_completed: true,
      }, { onConflict: 'user_id' })

    if (candidateError) {
      return NextResponse.json(
        { error: `Database error (candidates): ${candidateError.message}` },
        { status: 500 }
      )
    }

    // ── Step 3: Upsert skills ───────────────────────────────────────────
    const skillsToSave: { name: string; isPrimary: boolean }[] = []
    if (primary_skill) skillsToSave.push({ name: primary_skill, isPrimary: true })
    for (const s of secondary_skills) {
      if (s && typeof s === 'string') skillsToSave.push({ name: s, isPrimary: false })
    }

    for (const skill of skillsToSave) {
      // Ensure skill exists (upsert by name)
      const { data: skillRow } = await supabase
        .from('skills')
        .upsert({ name: skill.name }, { onConflict: 'name' })
        .select('id')
        .single()

      if (skillRow?.id) {
        await supabase
          .from('candidate_skills')
          .upsert(
            { candidate_id: userId, skill_id: skillRow.id, is_primary: skill.isPrimary },
            { onConflict: 'candidate_id,skill_id' }
          )
      }
    }

    // ── Step 4: Resume file upload ─────────────────────────────────────
    const resumeFile = formData.get('resume_file') as File | null
    let resumeFilePath: string | null = null

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

        const { error: resumeMetaError } = await supabase.from('resumes').insert({
          candidate_id: userId,
          title:        resume_title,
          file_path:    resumeFilePath,
          file_type:    resumeFile.type,
          file_size:    resumeFile.size,
          version:      1,
        })

        if (resumeMetaError) {
          console.error('Resume metadata error:', resumeMetaError.message)
        }
      }
    }

    // ── Step 5: Analytics event (best-effort) ──────────────────────────
    await supabase.from('analytics_events').insert({
      user_id:    userId,
      event_type: isNewUser ? 'candidate_registered' : 'candidate_profile_updated',
      metadata:   { resume_uploaded: !!resumeFilePath },
    }).then(() => {})

    return NextResponse.json({
      success:     true,
      message:     isNewUser
        ? 'Profile created! Check your email to sign in.'
        : 'Profile updated successfully.',
      user_id:     userId,
      is_new_user: isNewUser,
    })

  } catch (error: any) {
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

// ── Helpers ────────────────────────────────────────────────────────────────

function parseSalaryToNumber(raw: string | null): number | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'number') return parsed
    // { min, max, amount, value, ... }
    return parsed.min ?? parsed.amount ?? parsed.value ?? null
  } catch {
    const n = parseFloat(raw)
    return isNaN(n) ? null : n
  }
}

function mapVisibility(v: string): string {
  const map: Record<string, string> = {
    searchable_hidden_contact: 'public',
    searchable:                'public',
    hidden:                    'private',
    public:                    'public',
    private:                   'private',
  }
  return map[v] ?? 'public'
}
