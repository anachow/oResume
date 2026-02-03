/**
 * Supabase Client Configuration
 *
 * Client-side and server-side Supabase clients
 * All credentials are loaded from environment variables
 */

import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Client-side Supabase client
 * Use this in Client Components
 */
export const createBrowserClient = () => {
  return createClientComponentClient()
}

/**
 * Server-side Supabase client
 * Use this in Server Components and Server Actions
 */
export const createServerClient = () => {
  return createServerComponentClient({ cookies })
}

/**
 * Admin Supabase client with service role
 * CAUTION: Only use this for admin operations
 * This client bypasses RLS policies
 */
export const createAdminClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Basic client for non-authenticated operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
