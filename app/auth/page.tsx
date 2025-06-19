"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, UserIcon } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkUser()
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isForgotPassword) {
        // Password reset
        if (!email) {
          setMessage('אנא הזן כתובת מייל')
          setLoading(false)
          return
        }

        console.log('Attempting password reset for email:', email)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
          console.error('Password reset email error:', error)
          // More user-friendly error messages
          if (error.message.includes('rate_limit')) {
            setMessage('יותר מדי ניסיונות. נסה שוב בעוד כמה דקות')
          } else if (error.message.includes('email_not_confirmed')) {
            setMessage('כתובת המייל לא מאושרת')
          } else {
            setMessage('שגיאה בשליחת מייל איפוס סיסמה. וודא שכתובת המייל נכונה')
          }
        } else {
          setMessage('נשלח מייל לאיפוס סיסמה, אנא בדוק את תיבת הדואר שלך (כולל תיקיית הספאם)')
        }
      } else if (isSignUp) {
        // Sign up validation
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

        console.log('Attempting sign up for email:', email)
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          console.error('Sign up error:', error)
          if (error.message.includes('already_registered')) {
            setMessage('כתובת המייל כבר רשומה במערכת')
          } else if (error.message.includes('weak_password')) {
            setMessage('הסיסמה חלשה מדי. נסה סיסמה חזקה יותר')
          } else {
            setMessage('שגיאה בהרשמה. נסה שוב')
          }
        } else {
          console.log('Sign up successful:', data)
          setMessage('נשלח מייל אישור, אנא בדוק את תיבת הדואר שלך (כולל תיקיית הספאם)')
        }
      } else {
        // Sign in
        console.log('Attempting sign in for email:', email)
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error('Sign in error:', error)
          if (error.message.includes('email_not_confirmed')) {
            setMessage('אנא אשר את כתובת המייל לפני ההתחברות')
          } else if (error.message.includes('invalid_credentials')) {
            setMessage('כתובת מייל או סיסמה שגויים')
          } else {
            setMessage('שגיאה בהתחברות. נסה שוב')
          }
        } else {
          console.log('Sign in successful:', data)
          router.push('/')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage('אירעה שגיאה, נסה שוב')
    }

    setLoading(false)
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setIsForgotPassword(false)
    setMessage('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword)
    setIsSignUp(false)
    setMessage('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a2a5e] to-[#3a3a7e] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#E0D6F0] to-[#B8A9D9] rounded-full flex items-center justify-center mb-4">
            <UserIcon className="h-8 w-8 text-[#1a1a2e]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ברוכים הבאים ל-EchoMe
          </h2>
          <p className="text-[#E0D6F0] text-lg">
            המרחב הבטוח שלך להתפתחות אישית
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-white mb-2">
              {isForgotPassword ? 'איפוס סיסמה' : (isSignUp ? 'הרשמה' : 'התחברות')}
            </h3>
            <p className="text-[#E0D6F0]">
              {isForgotPassword ? 'הזן את כתובת המייל שלך לאיפוס הסיסמה' : (isSignUp ? 'צור חשבון חדש' : 'היכנס לחשבון שלך')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-[#E0D6F0] mb-2">
                כתובת מייל
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B8A9D9]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#B8A9D9] focus:outline-none focus:ring-2 focus:ring-[#E0D6F0] focus:border-transparent transition-all"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input - Hidden for forgot password */}
            {!isForgotPassword && (
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-[#E0D6F0] mb-2">
                  סיסמה
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
                    placeholder="הזן סיסמה"
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
            )}

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && !isForgotPassword && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E0D6F0] mb-2">
                  אישור סיסמה
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
            )}

            {/* Error/Success Message */}
            {message && (
              <div className={`p-3 rounded-lg text-center text-sm ${
                message.includes('נשלח מייל') || message.includes('נשלח מייל לאיפוס') 
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
              {loading ? 'טוען...' : (isForgotPassword ? 'שלח מייל לאיפוס' : (isSignUp ? 'הירשם' : 'התחבר'))}
            </button>
          </form>

          {/* Toggle Auth Mode & Forgot Password */}
          <div className="mt-6 text-center space-y-3">
            {!isForgotPassword ? (
              <>
                <p className="text-[#E0D6F0]">
                  {isSignUp ? 'כבר יש לך חשבון?' : 'אין לך עדיין חשבון?'}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={toggleAuthMode}
                    className="text-[#B8A9D9] hover:text-[#E0D6F0] font-medium transition-colors underline-offset-4 hover:underline"
                  >
                    {isSignUp ? 'התחבר' : 'הירשם'}
                  </button>
                  {!isSignUp && (
                    <button
                      onClick={toggleForgotPassword}
                      className="text-[#B8A9D9] hover:text-[#E0D6F0] font-medium transition-colors underline-offset-4 hover:underline text-sm"
                    >
                      שכחתי את הסיסמה
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-[#E0D6F0]">
                  זוכר את הסיסמה שלך?
                </p>
                <button
                  onClick={toggleForgotPassword}
                  className="text-[#B8A9D9] hover:text-[#E0D6F0] font-medium transition-colors underline-offset-4 hover:underline"
                >
                  חזור להתחברות
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#B8A9D9] text-sm">
          <p>המסע שלך להתפתחות אישית מתחיל כאן</p>
        </div>
      </div>
    </div>
  )
} 