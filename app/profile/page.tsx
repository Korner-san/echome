'use client'

import {
  ArrowLeftIcon,
  BrainIcon,
  MicIcon,
  BarChart3Icon,
  UserIcon,
  Settings,
  Bell,
  Moon,
  HelpCircle,
  BookOpenIcon,
  Camera,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import ProfileCard from "@/components/ProfileCard"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useUserProfile()
  const router = useRouter()
  const [profileImage, setProfileImage] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [userTitle, setUserTitle] = useState<string>("")
  const [saveMessage, setSaveMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update local state when profile is loaded
  useEffect(() => {
    console.log('Profile changed:', profile)
    if (profile) {
      console.log('Setting local state from profile:', {
        name: profile.name,
        title: profile.title,
        avatarUrl: profile.avatarUrl
      })
      setUserName(profile.name)
      setUserTitle(profile.title)
      setProfileImage(profile.avatarUrl)
    }
  }, [profile])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        updateProfile({ avatarUrl: result })
        showSaveMessage()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const showSaveMessage = () => {
    setSaveMessage("השינויים נשמרו בהצלחה!")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleNameChange = (newName: string) => {
    console.log('Changing name to:', newName)
    setUserName(newName)
    updateProfile({ name: newName })
    showSaveMessage()
  }

  const handleTitleChange = (newTitle: string) => {
    console.log('Changing title to:', newTitle)
    setUserTitle(newTitle)
    updateProfile({ title: newTitle })
    showSaveMessage()
  }



  // Check session function
  const checkSession = async () => {
    try {
      console.log('Checking current session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Session error:', error)
      
      if (session) {
        console.log('User is logged in:', session.user)
      } else {
        console.log('No active session found')
      }
    } catch (err) {
      console.error('Session check error:', err)
    }
  }

  // Quick login function for testing - go to auth page instead
  const quickLogin = () => {
    router.push('/auth')
  }

  // Show loading state
  if (loading) {
    return (
      <div dir="rtl" className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E0D6F0] mx-auto mb-4"></div>
          <p className="text-[#E0D6F0]">טוען פרופיל...</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={checkSession}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              בדוק Session
            </button>
            <button 
              onClick={quickLogin}
              className="px-4 py-2 bg-[#E0D6F0] text-[#2F2F3A] rounded-lg font-medium"
            >
              עבור להתחברות
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div dir="rtl" className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E0D6F0] mb-4">לא מחובר למערכת</p>
          <div className="flex flex-col gap-2 mb-4">
            <button 
              onClick={checkSession}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              בדוק Session
            </button>
            <button 
              onClick={quickLogin}
              className="px-4 py-2 bg-[#E0D6F0] text-[#2F2F3A] rounded-lg font-medium"
            >
              עבור להתחברות
            </button>
          </div>
          <br />
          <Link href="/auth" className="text-[#E0D6F0] underline">
            עבור לעמוד התחברות
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA]">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-sm font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full border border-[#FAFAFA] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C8E8D5] rounded-full"></div>
          </div>
          <div className="text-xs">85%</div>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeftIcon size={24} className="text-[#FAFAFA]" />
        </Link>
        <h1 className="text-2xl font-medium text-[#E0D6F0]">הפרופיל שלך</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-12rem)] px-6 pb-4 overflow-y-auto space-y-8">
        {/* Profile Card Section */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <ProfileCard
              name={userName}
              title={userTitle}
              handle=""
              status="פעיל"
              contactText="ערוך פרופיל"
              avatarUrl={profileImage}
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() => console.log('Edit profile clicked')}
              className="profile-card-custom"
            />
          </div>
          
          {/* Image Upload Button */}
          <button
            onClick={handleImageClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#E0D6F0]/20 hover:bg-[#E0D6F0]/30 rounded-lg text-[#E0D6F0] text-sm font-medium transition-all duration-200 border border-[#E0D6F0]/30"
          >
            <Camera size={16} />
            {profileImage ? "שנה תמונת פרופיל" : "הוסף תמונת פרופיל"}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* User Info Display */}
        {profile && (
          <div className="bg-[#2F2F3A]/70 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-medium text-[#FAFAFA] mb-4">מידע על החשבון</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#FAFAFA]/70">כתובת מייל:</span>
                <span className="text-sm text-[#E0D6F0]">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#FAFAFA]/70">תאריך הצטרפות:</span>
                <span className="text-sm text-[#E0D6F0]">
                  {profile.createdAt.toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Profile Info Edit Section */}
        <div className="bg-[#2F2F3A]/70 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#FAFAFA]">ערוך פרטי פרופיל</h3>
            {saveMessage && (
              <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs border border-green-500/30">
                {saveMessage}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#FAFAFA]/70 mb-2">שם</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#5A5D7C]/40 border border-[#FAFAFA]/20 rounded-lg text-[#FAFAFA] text-sm focus:outline-none focus:border-[#E0D6F0] transition-colors"
                placeholder="השם שלך"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FAFAFA]/70 mb-2">תפקיד</label>
              <input
                type="text"
                value={userTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#5A5D7C]/40 border border-[#FAFAFA]/20 rounded-lg text-[#FAFAFA] text-sm focus:outline-none focus:border-[#E0D6F0] transition-colors"
                placeholder="התפקיד שלך"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div>
          <h2 className="text-xl font-medium mb-4 text-[#FAFAFA]">הסטטיסטיקות שלך</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#E0D6F0] mb-1">28</p>
              <p className="text-xs text-[#FAFAFA]/70">סשנים</p>
            </div>
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#C5DCF0] mb-1">12h</p>
              <p className="text-xs text-[#FAFAFA]/70">זמן כולל</p>
            </div>
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#C8E8D5] mb-1">5</p>
              <p className="text-xs text-[#FAFAFA]/70">רצפים</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-xl font-medium mb-5 text-[#FAFAFA]">הגדרות</h2>
          <div className="space-y-4 bg-[#2F2F3A]/70 rounded-xl p-4 shadow-sm">
            {[
              { icon: Settings, label: "הגדרות אפליקציה" },
              { icon: Bell, label: "התראות" },
              { icon: Moon, label: "מראה" },
              { icon: HelpCircle, label: "עזרה ותמיכה" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-[#5A5D7C]/40 rounded-xl shadow-sm hover:bg-[#5A5D7C]/50 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full bg-[#FAFAFA]/15 flex items-center justify-center mr-4 shadow-inner">
                  <item.icon size={20} className="text-[#FAFAFA]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#FAFAFA]">{item.label}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAFAFA]/15 flex items-center justify-center">
                  <ArrowLeftIcon size={16} className="text-[#FAFAFA] rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-gradient-to-r from-[#E0D6F0] to-[#C5DCF0] rounded-xl p-5 shadow-[0_0_25px_rgba(224,214,240,0.3)]">
          <h3 className="text-[#2F2F3A] font-medium text-lg mb-2">חברות פרימיום</h3>
          <p className="text-[#2F2F3A]/90 text-sm mb-4 leading-relaxed">
            פתח את כל נתיבי הצמיחה והתכונות להתבוננות עמוקה יותר
          </p>
          <button className="bg-[#2F2F3A] text-[#FAFAFA] rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-[#2F2F3A]/90 transition-all duration-200">
            שדרג עכשיו
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar - Updated Order: Journal, Growth, Chat, Progress, Profile */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">יומן</span>
          </Link>
          <Link href="/growth" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BrainIcon size={24} />
            <span className="text-xs font-medium">צמיחה</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <MicIcon size={24} />
            <span className="text-xs font-medium">צ'אט</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BarChart3Icon size={24} />
            <span className="text-xs font-medium">התקדמות</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
            <UserIcon size={24} />
            <span className="text-xs font-medium">פרופיל</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
