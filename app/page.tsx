"use client"

import { MicIcon, TrophyIcon, BarChart3Icon, UserIcon, XIcon, CheckIcon, BookOpenIcon, LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useVoiceRecording } from "@/hooks/useVoiceRecording"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface JournalTask {
  id: string
  title: string
  content: string
  urgency: 'מאוד חשוב' | 'חשוב' | 'אפשר לחכות' | 'מתי שתרצה'
  date: Date
  completed: boolean
}

const WELCOME_MESSAGES = [
  "דבר איתי: מה צריך לקרות היום?",
  "אם אתה לא יודע מאיפה להתחיל, אני פה כדי לשאול אותך את השאלות הנכונות",
  "אני כאן כדי ללוות אותך במסע ההתפתחות שלך.",
  "על מה היית רוצה להרהר היום?"
]

// No star animation - removed completely

// Achievement celebration overlay component
const AchievementCelebration = ({ onClose, achievementType, setHighlightTab }: { 
  onClose: () => void, 
  achievementType: string,
  setHighlightTab: (highlight: boolean) => void 
}) => {

  useEffect(() => {
    console.log('🎉 AchievementCelebration mounted for:', achievementType)
    
    // Start highlighting achievements tab immediately
    setHighlightTab(true)

    // Close celebration after 4 seconds (same as before)
    const closeTimer = setTimeout(() => {
      console.log('🎉 Closing achievement celebration')
      onClose()
    }, 4000)

    return () => {
      console.log('🎉 AchievementCelebration cleanup')
      clearTimeout(closeTimer)
    }
  }, [onClose, achievementType, setHighlightTab])

  const getAchievementTitle = (type: string) => {
    switch (type) {
      case 'first_task': return 'המשימה הראשונה'
      case 'task_master_2': return 'אמן המשימות - רמה 2'
      case 'task_master_3': return 'אמן המשימות - רמה 3'
      case 'task_master_4': return 'אמן המשימות - רמה 4'
      case 'task_master_5': return 'אמן המשימות - רמה 5'
      case 'task_master_6': return 'אמן המשימות - רמה 6'
      case 'task_master_7': return 'אמן המשימות - רמה 7'
      case 'task_master_8': return 'אמן המשימות - רמה 8'
      case 'task_master_9': return 'אמן המשימות - רמה 9'
      case 'task_master_10': return 'אמן המשימות - רמה 10'
      default: return 'הישג חדש'
    }
  }

  return (
    <>
      {/* Achievement celebration - positioned to not cover bottom navigation */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Semi-transparent overlay but with clear bottom area */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
        
        {/* Achievement content */}
        <div className="relative pointer-events-auto" style={{ marginBottom: '8rem' }}>
          <img 
            src="/celebrate_achievement.gif" 
            alt="Achievement Unlocked!" 
            className="w-80 h-80 object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 rounded-xl p-6 text-center border-2 border-yellow-400/30">
              <TrophyIcon size={48} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                הישג חדש נפתח! 🎉
              </h2>
              <p className="text-lg text-yellow-200">
                {getAchievementTitle(achievementType)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* No star animation */}
      
      {/* No local highlight effect - handled globally */}
      {false && (
        <div className="fixed bottom-0 left-0 right-0 z-[90] pointer-events-none">
          <div className="bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
            <div className="flex justify-around items-center py-3 px-6">
              <div className="flex flex-col items-center gap-1 opacity-30">
                <BookOpenIcon size={24} />
                <span className="text-xs font-medium text-[#FAFAFA]">יומן</span>
              </div>
              
              {/* Highlighted Achievements Tab */}
              <div className="flex flex-col items-center gap-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300/40 to-yellow-500/40 rounded-xl animate-pulse"></div>
                <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/60 to-yellow-600/60 rounded-xl animate-ping"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/80 to-yellow-600/80 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="relative bg-gradient-to-r from-yellow-300 to-yellow-500 text-black rounded-lg px-4 py-3 shadow-[0_0_35px_rgba(255,215,0,0.9)] border-2 border-yellow-200">
                  <TrophyIcon size={24} />
                </div>
                <span className="text-xs font-medium text-yellow-300 relative animate-pulse">הישגים</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 opacity-30">
                <MicIcon size={24} />
                <span className="text-xs font-medium text-[#FAFAFA]">שיחה</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-30">
                <BarChart3Icon size={24} />
                <span className="text-xs font-medium text-[#FAFAFA]">התקדמות</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-30">
                <UserIcon size={24} />
                <span className="text-xs font-medium text-[#FAFAFA]">פרופיל</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Waveform animation component
const WaveformAnimation = () => {
  const [bars, setBars] = useState<number[]>(Array(8).fill(0.3))
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2))
    }, 150)

    return () => clearInterval(interval)
  }, [])

  // Don't animate on server-side render to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center gap-1 h-8">
        {Array(8).fill(0.3).map((height, index) => (
          <div
            key={index}
            className="w-1 bg-[#E0D6F0] rounded-full transition-all duration-150"
            style={{ height: `${height * 100}%` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 h-8">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-[#E0D6F0] rounded-full transition-all duration-150"
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  )
}

// Recording timer component
const RecordingTimer = ({ startTime }: { startTime: number }) => {
  const [elapsed, setElapsed] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (startTime > 0) {
      const interval = setInterval(() => {
        setElapsed(Date.now() - startTime)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime])

  // Don't show time on server-side render to prevent hydration mismatch
  if (!isClient || startTime === 0) {
    return (
      <div className="text-[#E0D6F0] text-sm font-mono">
        00:00
      </div>
    )
  }

  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)

  return (
    <div className="text-[#E0D6F0] text-sm font-mono">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}

// Function to unlock achievement
const unlockAchievement = async (userId: string, achievementType: string) => {
  try {
    console.log('Attempting to unlock achievement:', achievementType, 'for user:', userId)
    
    const { data, error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_type: achievementType,
        earned_at: new Date().toISOString(),
        progress: 1,
        target: 1
      }, {
        onConflict: 'user_id,achievement_type'
      })
      .select()

    if (error) {
      console.error('Supabase error unlocking achievement:', error)
      return false
    }

    console.log('Achievement unlocked successfully:', data)
    return true
  } catch (error) {
    console.error('Unexpected error unlocking achievement:', error)
    return false
  }
}

// Check if this is the first task created
const checkFirstTaskAchievement = async (userId: string) => {
  try {
    console.log('Checking if user has first_task achievement:', userId)
    
    // Check if user already has the first task achievement
    const { data: existingAchievement, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_type', 'first_task')
      .single()

    console.log('First task check result:', { existingAchievement, error })

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking first task achievement:', error)
      return false
    }

    // If no achievement exists, this is the first task
    const isFirstTask = !existingAchievement
    console.log('Is first task result:', isFirstTask)
    return isFirstTask
  } catch (error) {
    console.error('Unexpected error checking first task achievement:', error)
    return false
  }
}

// Check for task master achievements (2-10 tasks)
const checkTaskMasterAchievements = async (userId: string, currentTaskCount: number) => {
  try {
    // Check which achievements to unlock based on task count
    const achievementsToCheck = []
    for (let i = 2; i <= 10; i++) {
      if (currentTaskCount >= i) {
        achievementsToCheck.push(`task_master_${i}`)
      }
    }

    const newAchievements = []

    // Check each potential achievement
    for (const achievementType of achievementsToCheck) {
      const { data: existingAchievement, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_type', achievementType)
        .single()

      if (error && error.code === 'PGRST116') { // Achievement doesn't exist yet
        newAchievements.push(achievementType)
      }
    }

    return newAchievements
  } catch (error) {
    console.error('Error checking task master achievements:', error)
    return []
  }
}

// Determine urgency based on content
const determineUrgency = (text: string): JournalTask['urgency'] => {
  if (text.includes('דחוף') || text.includes('מיידי') || text.includes('עכשיו')) {
    return 'מאוד חשוב'
  }
  if (text.includes('חשוב') || text.includes('כדאי')) {
    return 'חשוב'
  }
  if (text.includes('בזמנך') || text.includes('כשתוכל')) {
    return 'מתי שתרצה'
  }
  return 'אפשר לחכות'
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [completedTexts, setCompletedTexts] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0)
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<string>('')
  const [achievementQueue, setAchievementQueue] = useState<string[]>([])
  const [highlightAchievementsTab, setHighlightAchievementsTab] = useState(false)
  const router = useRouter()
  
  const { isRecording, transcript, startRecording, stopRecording, error } = useVoiceRecording()

  // Function to show achievements in queue
  const showNextAchievement = () => {
    console.log('🌟 showNextAchievement called')
    console.log('🌟 Current achievementQueue length:', achievementQueue.length)
    console.log('🌟 Current achievementQueue:', achievementQueue)
    
    if (achievementQueue.length > 0) {
      const nextAchievement = achievementQueue[0]
      console.log('🌟 Showing achievement:', nextAchievement)
      setCurrentAchievement(nextAchievement)
      setShowAchievement(true)
      setAchievementQueue(prev => {
        const newQueue = prev.slice(1)
        console.log('🌟 Remaining queue after showing:', newQueue)
        return newQueue
      })
    } else {
      console.log('🌟 No achievements in queue to show')
    }
  }

  // Handle achievement completion
  const handleAchievementComplete = () => {
    setShowAchievement(false)
    setCurrentAchievement('')
    
    // Show next achievement if any in queue
    setTimeout(() => {
      showNextAchievement()
    }, 500)
  }

  // Add achievements to queue
  const queueAchievements = (achievements: string[]) => {
    console.log('🎯 queueAchievements called with:', achievements)
    console.log('🎯 Current showAchievement state:', showAchievement)
    console.log('🎯 Current achievementQueue:', achievementQueue)
    
    if (achievements.length > 0) {
      setAchievementQueue(prev => {
        const newQueue = [...prev, ...achievements]
        console.log('🎯 New achievement queue:', newQueue)
        return newQueue
      })
      
      // If no achievement is currently showing, start showing the first one
      if (!showAchievement) {
        console.log('🎯 No achievement currently showing, starting timer...')
        setTimeout(() => {
          console.log('🎯 Timer fired, calling showNextAchievement')
          showNextAchievement()
        }, 100)
      } else {
        console.log('🎯 Achievement already showing, will queue for later')
      }
    } else {
      console.log('🎯 No achievements to queue')
    }
  }

  // Authentication check - always runs, but only executes on client side
  useEffect(() => {
    // Only run authentication check on client side
    if (typeof window === 'undefined') return

    const getSession = async () => {
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
        }
        
        setUser(currentUser)
        setLoading(false)
        
        if (!currentUser) {
          console.log('No user found, redirecting to auth')
          router.push('/auth')
        } else {
          console.log('User authenticated:', currentUser.email)
        }
      } catch (err) {
        console.error('Unexpected auth error:', err)
        setLoading(false)
        router.push('/auth')
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        if (!session?.user && event !== 'INITIAL_SESSION') {
          router.push('/auth')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedMessages = localStorage.getItem('chatMessages')
      if (savedMessages && savedMessages !== 'undefined') {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(parsedMessages)
      }
    } catch (parseError) {
      console.error('Error loading saved messages:', parseError)
      // Clear corrupted data
      localStorage.removeItem('chatMessages')
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      if (messages.length > 0) {
        localStorage.setItem('chatMessages', JSON.stringify(messages))
      } else {
        localStorage.removeItem('chatMessages')
      }
    } catch (error) {
      console.error('Error saving messages to localStorage:', error)
    }
  }, [messages])

  // Typewriter effect
  useEffect(() => {
    if (currentMessageIndex >= WELCOME_MESSAGES.length) return

    const text = WELCOME_MESSAGES[currentMessageIndex]
    setCurrentText("")

    // Messages 2 and 3 should appear instantly (no typing animation)
    if (currentMessageIndex >= 2) {
      setCurrentText(text)
      
      // Add completed text to array
      setCompletedTexts(prev => [...prev, text])
      
      // Move to next message after delay - longer delay between 3rd and 4th messages
      const delay = currentMessageIndex === 2 ? 1000 : 500 // 1 second delay after 3rd message
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1)
      }, delay)
      return
    }

    // Messages 0 and 1 use faster typing (20ms instead of 40ms)
    let charIndex = 0
    const typeTimer = setInterval(() => {
      if (charIndex < text.length) {
        setCurrentText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeTimer)
        
        // Add completed text to array
        setCompletedTexts(prev => [...prev, text])
        
        // Move to next message after delay
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
        }, 500)
      }
    }, 27) // 1.5x faster: 27ms instead of 40ms for first two messages

    return () => clearInterval(typeTimer)
  }, [currentMessageIndex])

  // Clear chat function
  const clearChat = () => {
    setMessages([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a2a5e] to-[#3a3a7e] flex items-center justify-center">
        <div className="text-white text-xl">טוען...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  const handleVoiceButtonClick = async () => {
    if (isRecording) {
      console.log('Stopping recording...')
      const finalTranscript = await stopRecording()
      setRecordingStartTime(0)
      
      console.log('Final transcript received:', finalTranscript)
      
      // Process the transcript if we have one
      if (finalTranscript.trim()) {
        console.log('Processing message:', finalTranscript.trim())
        await processMessage(finalTranscript.trim())
      } else {
        console.log('No transcript captured')
        // Show error message to user
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "לא קלטתי את זה. אפשר לנסות לדבר שוב?",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } else {
      console.log('Starting recording...')
      setRecordingStartTime(Date.now())
      await startRecording()
    }
  }

  const processMessage = async (message: string) => {
    console.log('Processing message function called with:', message)
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    }
    
    console.log('Adding user message to chat:', userMessage)
    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    try {
      console.log('Sending request to /api/chat')
      // Send to ChatGPT API
            const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: user?.id, // Send user ID for context
          chatHistory: messages // Send chat history for context
        }),
      })

      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`שגיאת שרת: ${response.status}`)
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text()
        console.error('Non-JSON response received:', responseText)
        throw new Error('השרת החזיר תשובה לא תקינה. אנא נסה שוב.')
      }

      let data
      try {
        const responseText = await response.text()
        console.log('Raw response:', responseText)
        data = JSON.parse(responseText)
        console.log('Parsed API Response data:', data)
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('תשובה לא תקינה מהשרת - בעיית JSON')
      }

      // Validate response structure
      if (!data.reply) {
        console.error('Invalid response structure:', data)
        throw new Error('תשובה לא תקינה מהשרת - חסרים נתונים')
      }

      if (true) { // Always true since we checked response.ok above
        // Add AI response to chat
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.reply,
          isUser: false,
          timestamp: new Date()
        }
        
        console.log('Adding AI message to chat:', aiMessage)
        setMessages(prev => [...prev, aiMessage])

        // Check if AI response contains a task and save to journal
        if (data.hasTask && data.taskTitle && user) {
          const task: JournalTask = {
            id: Date.now().toString(),
            title: data.taskTitle,
            content: data.reply.length > 150 ? data.reply.substring(0, 150) + '...' : data.reply,
            urgency: determineUrgency(data.reply),
            date: new Date(),
            completed: false
          }
          
          // Save to both localStorage and Supabase
          if (typeof window !== 'undefined') {
            try {
              // Save to localStorage for immediate UI update
              const existingTasks = JSON.parse(localStorage.getItem('journalTasks') || '[]')
              localStorage.setItem('journalTasks', JSON.stringify([...existingTasks, task]))
              
              // Also save to Supabase database
              const { createClient } = await import('@supabase/supabase-js')
              const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              )
              
              await supabase.from('tasks').insert({
                user_id: user.id,
                title: task.title,
                content: task.content,
                urgency: task.urgency,
                completed: task.completed,
                date: new Date().toISOString().split('T')[0], // Date only
                created_at: new Date().toISOString()
              })
              
              console.log('Task saved to both localStorage and database:', task)
            } catch (error) {
              console.error('Error saving task:', error)
            }
          }
          
          // Check for achievements after saving the task
          console.log('=== ACHIEVEMENT CHECK START (DEMO MODE) ===')
          console.log('User ID:', user.id)
          console.log('User email:', user.email)
          
          // DEMO MODE: Always show achievement for every task
          const newAchievements = []
          
          // Get current task count after saving the new task
          const currentTasks = JSON.parse(localStorage.getItem('journalTasks') || '[]')
          console.log('Current task count:', currentTasks.length)
          
          // Always show an achievement based on task count
          let achievementToShow = ''
          if (currentTasks.length === 1) {
            achievementToShow = 'first_task'
          } else if (currentTasks.length <= 10) {
            achievementToShow = `task_master_${currentTasks.length}`
          } else {
            // For tasks beyond 10, cycle through achievements
            const cycleIndex = ((currentTasks.length - 1) % 10) + 1
            achievementToShow = cycleIndex === 1 ? 'first_task' : `task_master_${cycleIndex}`
          }
          
          console.log('DEMO MODE: Showing achievement:', achievementToShow)
          newAchievements.push(achievementToShow)
          
          console.log('All new achievements (DEMO):', newAchievements)
          
          // Queue all new achievements for display
          console.log('Queueing achievements for display:', newAchievements)
          queueAchievements(newAchievements)
          
          console.log('=== ACHIEVEMENT CHECK END ===')
          console.log('Task saved to journal:', task)
        }
      } else {
        console.error('API Error:', response.status, data)
        throw new Error(data.error || `API Error: ${response.status}`)
      }
    } catch (error) {
      console.error('=== Client-side error processing message ===')
      console.error('Error type:', typeof error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('Full error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `שגיאה: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div dir="rtl" className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA]">
      {/* Achievement Celebration Overlay */}
      {showAchievement && currentAchievement && (
        <AchievementCelebration 
          onClose={handleAchievementComplete} 
          achievementType={currentAchievement}
          setHighlightTab={setHighlightAchievementsTab}
        />
      )}

      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full border border-[#FAFAFA] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C8E8D5] rounded-full"></div>
          </div>
          <div className="text-xs">85%</div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-[#E0D6F0] to-[#B8A9D9] rounded-full flex items-center justify-center">
              <UserIcon className="w-3 h-3 text-[#1a1a2e]" />
            </div>
            <span className="text-xs text-[#E0D6F0]">
              {user?.email ? user.email.split('@')[0] : 'משתמש'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            title="התנתק"
          >
            <LogOutIcon className="w-3 h-3 text-[#E0D6F0]" />
            <span className="text-xs text-[#E0D6F0]">התנתק</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">9:41</div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors px-2 py-1 rounded"
            >
              נקה שיחה
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-8rem)] px-6 pt-6 pb-4">
        {/* Welcome Messages */}
        <div className="mb-8 text-right">
          {/* First message */}
          <div className="mb-2 min-h-[2.5em]">
            {(completedTexts[0] || (currentMessageIndex === 0 && currentText)) && (
              <h1 className="text-3xl font-medium text-[#E0D6F0]">
                {completedTexts[0] || currentText}
              </h1>
            )}
          </div>
          
          {/* Second message */}
          <div className="min-h-[3em]">
            {(completedTexts[1] || (currentMessageIndex === 1 && currentText)) && (
              <h2 className="text-xl font-light text-[#FAFAFA]">
                {completedTexts[1] || currentText}
              </h2>
            )}
          </div>
        </div>

        {/* TAK Avatar positioned above chat area */}
        <div className="relative mb-2">
          <div className="absolute -bottom-4 right-4 z-20">
            <div className="relative transition-all duration-300 hover:scale-105">
              <img 
                src="/static TAK.png" 
                alt="TAK" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  console.error('Failed to load TAK avatar');
                  const img = e.target as HTMLImageElement;
                  if (img.src.includes('static TAK.png')) {
                    img.src = '/static_tak.png';
                  }
                }}
              />
              {/* Small indicator that TAK is listening/active */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C8E8D5] rounded-full border-2 border-[#2F2F3A] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#2F2F3A]/30 backdrop-blur-sm p-5 mb-6">
          <div className="flex flex-col gap-4">
            {/* Third message with TAK */}
            {(completedTexts[2] || (currentMessageIndex === 2 && currentText)) && (
              <div className="flex items-start gap-3 self-start max-w-[85%]">
                <div className="flex-shrink-0">
                  <img 
                    src="/static TAK.png" 
                    alt="TAK" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src.includes('static TAK.png')) {
                        img.src = '/static_tak.png';
                      }
                    }}
                  />
                </div>
                <div className="bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-2xl rounded-tr-sm p-4 text-right">
                  {completedTexts[2] || currentText}
                </div>
              </div>
            )}
            
            {/* Fourth message with TAK */}
            {(completedTexts[3] || (currentMessageIndex === 3 && currentText)) && (
              <div className="flex items-start gap-3 self-start max-w-[85%]">
                <div className="flex-shrink-0">
                  <img 
                    src="/static TAK.png" 
                    alt="TAK" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src.includes('static TAK.png')) {
                        img.src = '/static_tak.png';
                      }
                    }}
                  />
                </div>
                <div className="bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-2xl rounded-tr-sm p-4 text-right">
                  {completedTexts[3] || currentText}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.isUser
                    ? "self-start bg-[#C8E8D5]/90 text-[#2F2F3A] rounded-tr-sm"
                    : "self-start bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-tr-sm"
                )}
                style={{ 
                  direction: 'rtl', 
                  textAlign: 'right',
                  unicodeBidi: 'embed'
                }}
                dir="rtl"
              >
                <div 
                  style={{ 
                    direction: 'rtl', 
                    unicodeBidi: 'plaintext',
                    display: 'block',
                    textAlign: 'right',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  dir="auto"
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {/* Show current transcript while recording */}
            {isRecording && transcript && (
              <div 
                className="self-start max-w-[80%] bg-[#E0D6F0]/70 text-[#2F2F3A] rounded-2xl rounded-tr-sm p-4 opacity-75"
                style={{ 
                  direction: 'rtl', 
                  textAlign: 'right',
                  unicodeBidi: 'embed',
                  writingMode: 'horizontal-tb',
                  textOrientation: 'mixed'
                }}
                dir="rtl"
              >
                <span style={{ direction: 'rtl', unicodeBidi: 'embed' }}>
                  {transcript}
                </span>
              </div>
            )}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 rounded-2xl rounded-tr-sm p-4 text-[#FAFAFA]">
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            
            {/* Error display */}
            {error && (
              <div 
                className="self-center max-w-[80%] bg-red-500/20 text-red-200 rounded-2xl p-4 text-sm"
                style={{ 
                  direction: 'rtl', 
                  textAlign: 'right',
                  unicodeBidi: 'embed'
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Voice Input Area */}
        <div className="relative flex flex-col items-center mb-10" dir="ltr">
          {/* Recording feedback - waveform and timer */}
          {isRecording && recordingStartTime > 0 && (
            <div className="flex items-center gap-4 mb-4 bg-[#2F2F3A]/50 backdrop-blur-sm rounded-full px-6 py-3">
              <WaveformAnimation />
              <RecordingTimer startTime={recordingStartTime} />
            </div>
          )}

          <div className="relative flex justify-center items-center">
            {/* Multiple layered auras for depth - more subtle and clean */}
            <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-[#E0D6F0]/6 to-[#C5DCF0]/6 animate-pulse"></div>
            <div
              className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-[#E0D6F0]/8 to-[#C5DCF0]/8 animate-pulse"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[#C5DCF0]/10 to-[#FADDE3]/10 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>

            {/* Main button with subtle shadow - cleaner look */}
            <button 
              onClick={handleVoiceButtonClick}
              disabled={isProcessing}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(224,214,240,0.3)] relative z-10 transition-all duration-200",
                isRecording 
                  ? "bg-gradient-to-br from-[#4A5D8C] via-[#5A5D7C] to-[#3A4D6C] scale-110" 
                  : "bg-gradient-to-br from-[#C5DCF0] via-[#E0D6F0] to-[#FADDE3] hover:from-[#B5CCE0] hover:via-[#D0C6E0] hover:to-[#EACDD3] hover:scale-105",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200",
                isRecording 
                  ? "bg-gradient-to-br from-[#5A5D7C] via-[#4A5D8C] to-[#3A4D6C]" 
                  : "bg-gradient-to-br from-[#C5DCF0] via-[#FADDE3] to-[#C8E8D5] hover:from-[#B5CCE0] hover:via-[#EACDD3] hover:to-[#B8D8C5]"
              )}>
                <MicIcon size={32} className={cn(
                  "transition-colors duration-200",
                  isRecording ? "text-white" : "text-[#2F2F3A]"
                )} />
              </div>
            </button>

            <div className="absolute -bottom-10 text-center">
              <p className="text-[#FAFAFA] text-sm font-medium tracking-wide">
                {isRecording ? "מקליט... לחץ כדי להפסיק" : isProcessing ? "מעבד..." : "לחץ כדי לדבר"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Controls - Only visible when recording */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-[#FAFAFA]/15 backdrop-blur-md rounded-full px-4 py-2 hidden">
        <div className="flex items-center gap-6">
          <button className="w-10 h-10 rounded-full bg-[#FAFAFA]/30 flex items-center justify-center">
            <XIcon size={20} className="text-[#FADDE3]" />
          </button>
          <div className="w-3 h-3 rounded-full bg-[#FADDE3] animate-pulse"></div>
          <button className="w-10 h-10 rounded-full bg-[#FAFAFA]/30 flex items-center justify-center">
            <CheckIcon size={20} className="text-[#C8E8D5]" />
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar - Updated with הישגים */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">יומן</span>
          </Link>
          <Link 
            href="/growth" 
            className={cn(
              "flex flex-col items-center gap-1 transition-colors relative",
              highlightAchievementsTab 
                ? "text-yellow-300" 
                : "text-[#FAFAFA]/60 hover:text-[#FAFAFA]"
            )}
            onClick={() => setHighlightAchievementsTab(false)}
          >
            {/* Highlight effects when achievements tab should be highlighted */}
            {highlightAchievementsTab && (
              <>
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300/40 to-yellow-500/40 rounded-xl animate-pulse"></div>
                <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/60 to-yellow-600/60 rounded-xl animate-ping"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/80 to-yellow-600/80 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </>
            )}
            <div className={cn(
              "relative transition-all duration-200",
              highlightAchievementsTab 
                ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black rounded-lg px-4 py-3 shadow-[0_0_35px_rgba(255,215,0,0.9)] border-2 border-yellow-200"
                : ""
            )}>
              <TrophyIcon size={24} />
            </div>
            <span className={cn(
              "text-xs font-medium relative",
              highlightAchievementsTab ? "animate-pulse" : ""
            )}>
              הישגים
            </span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
            <MicIcon size={24} />
            <span className="text-xs font-medium">שיחה</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BarChart3Icon size={24} />
            <span className="text-xs font-medium">התקדמות</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <UserIcon size={24} />
            <span className="text-xs font-medium">פרופיל</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
