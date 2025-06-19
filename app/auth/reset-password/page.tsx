"use client"

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { EyeIcon, EyeOffIcon, LockIcon, CheckCircleIcon } from 'lucide-react'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return
    
    // Check if we have the necessary parameters for password reset
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setMessage('קישור איפוס סיסמה לא תקין')
      return
    }

    // Set the session with the tokens from the URL
    const setSessionFromUrl = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('Session error:', error)
          setMessage('קישור איפוס סיסמה פג תוקף או לא תקין')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setMessage('שגיאה בטעינת הדף')
      }
    }

    setSessionFromUrl()
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validation
    if (password !== confirmPassword) {
      setMessage('הסיסמאות לא תואמות')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage('הסיסמה חייבת להכיל לפחות 6 תווים')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        setMessage(`שגיאה בעדכון הסיסמה: ${error.message}`)
      } else {
        setIsSuccess(true)
        setMessage('הסיסמה עודכנה בהצלחה!')
        
        // Redirect to main app after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error) {
      console.error('Unexpected password reset error:', error)
      setMessage('אירעה שגיאה, נסה שוב')
    }

    setLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a2a5e] to-[#3a3a7e] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              הסיסמה עודכנה בהצלחה!
            </h2>
            <p className="text-[#E0D6F0] text-lg">
              מעביר אותך לאפליקציה...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a2a5e] to-[#3a3a7e] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#E0D6F0] to-[#B8A9D9] rounded-full flex items-center justify-center mb-4">
            <LockIcon className="h-8 w-8 text-[#1a1a2e]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            הגדר סיסמה חדשה
          </h2>
          <p className="text-[#E0D6F0] text-lg">
            הזן את הסיסמה החדשה שלך
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* New Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#E0D6F0] mb-2">
                סיסמה חדשה
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B8A9D9]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#B8A9D9] focus:outline-none focus:ring-2 focus:ring-[#E0D6F0] focus:border-transparent transition-all"
                  placeholder="הזן סיסמה חדשה"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B8A9D9] hover:text-[#E0D6F0] transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E0D6F0] mb-2">
                אישור סיסמה חדשה
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B8A9D9]" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#B8A9D9] focus:outline-none focus:ring-2 focus:ring-[#E0D6F0] focus:border-transparent transition-all"
                  placeholder="הזן סיסמה שוב"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B8A9D9] hover:text-[#E0D6F0] transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div className={`p-3 rounded-lg text-center text-sm ${
                message.includes('בהצלחה') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E0D6F0] to-[#B8A9D9] text-[#1a1a2e] font-semibold rounded-lg hover:from-[#B8A9D9] hover:to-[#9A8BC8] focus:outline-none focus:ring-2 focus:ring-[#E0D6F0] focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? 'מעדכן...' : 'עדכן סיסמה'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[#B8A9D9] text-sm">
          <p>לאחר עדכון הסיסמה תועבר לאפליקציה</p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a2a5e] to-[#3a3a7e] flex items-center justify-center">
        <div className="text-white text-xl">טוען...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
} 