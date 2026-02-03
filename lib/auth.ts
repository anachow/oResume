/**
 * Authentication utility functions
 *
 * Handles user authentication, session management, and role verification
 */

import { createServerClient } from './supabase'
import type { UserType } from '@/types'

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = createServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get the current user's session
 */
export async function getSession() {
  const supabase = createServerClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  return session
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Get user type from database
 */
export async function getUserType(userId: string): Promise<UserType | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.user_type as UserType
}

/**
 * Check if user has specific role
 */
export async function hasRole(userId: string, role: UserType): Promise<boolean> {
  const userType = await getUserType(userId)
  return userType === role
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'admin')
}

/**
 * Verify email
 */
export async function verifyEmail(token: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  })

  return { data, error }
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createServerClient()
  return await supabase.auth.signOut()
}
