import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  name: string
  title: string
  handle: string
  avatarUrl: string
  createdAt: Date
}

interface DatabaseProfile {
  id: string
  user_id: string
  display_name: string | null
  handle: string | null
  avatar_url: string | null
  title: string | null
  created_at: string
  updated_at: string
}

const extractNameFromEmail = (email: string): string => {
  // Extract name from email before @ symbol
  const localPart = email.split('@')[0]
  
  // Remove common separators and numbers
  const cleanName = localPart
    .replace(/[._-]/g, ' ')
    .replace(/\d+/g, '')
    .trim()
  
  // Capitalize first letter of each word
  return cleanName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim() || 'משתמש'
}

const generateHandleFromEmail = (email: string): string => {
  const localPart = email.split('@')[0]
  return `${localPart}@`
}

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = async (currentUser: User) => {
    console.log('Loading profile for user:', currentUser.id)
    
    try {
      // Try to get existing profile from database
      const { data: existingProfiles, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      console.log('Database query result:', { data: existingProfiles, error: fetchError })

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error fetching profile:', fetchError)
      }

      let userProfile: UserProfile

      if (existingProfiles) {
        // Use existing profile from database
        userProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          name: existingProfiles.display_name || extractNameFromEmail(currentUser.email || ''),
          title: existingProfiles.title || 'מפתח תוכנה',
          handle: existingProfiles.handle || generateHandleFromEmail(currentUser.email || ''),
          avatarUrl: existingProfiles.avatar_url || '',
          createdAt: new Date(currentUser.created_at)
        }
      } else {
        // Create new profile for new user
        const extractedName = extractNameFromEmail(currentUser.email || '')
        const handle = generateHandleFromEmail(currentUser.email || '')
        
        userProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          name: extractedName,
          title: 'מפתח תוכנה',
          handle: handle,
          avatarUrl: '',
          createdAt: new Date(currentUser.created_at)
        }

        // Save new profile to database
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: currentUser.id,
            display_name: extractedName,
            handle: handle,
            avatar_url: '',
            title: 'מפתח תוכנה'
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
      }

      console.log('Setting profile:', userProfile)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
      // Fallback to basic profile
      const userProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email || '',
        name: extractNameFromEmail(currentUser.email || ''),
        title: 'מפתח תוכנה',
        handle: generateHandleFromEmail(currentUser.email || ''),
        avatarUrl: '',
        createdAt: new Date(currentUser.created_at)
      }
      setProfile(userProfile)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      console.log('Getting user from Supabase...')
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Error getting user:', error)
          setLoading(false)
          return
        }

        console.log('Current user from Supabase:', currentUser)
        setUser(currentUser)

        if (currentUser) {
          await loadUserProfile(currentUser)
        } else {
          console.log('No user found - not authenticated')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !user) {
      console.log('Cannot update profile - missing profile or user:', { profile: !!profile, user: !!user })
      return
    }

    console.log('Updating profile with:', updates)

    try {
      // Update local state immediately for better UX
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)

      // Prepare database update object
      const dbUpdate: any = {}
      if (updates.name !== undefined) dbUpdate.display_name = updates.name
      if (updates.handle !== undefined) dbUpdate.handle = updates.handle
      if (updates.avatarUrl !== undefined) dbUpdate.avatar_url = updates.avatarUrl
      if (updates.title !== undefined) dbUpdate.title = updates.title

      console.log('Database update object:', dbUpdate)

      // Update database
      const { error } = await supabase
        .from('user_profiles')
        .update(dbUpdate)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        // Revert local state on error
        setProfile(profile)
        throw error
      }

      console.log('Profile updated successfully in database')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    updateProfile
  }
} 