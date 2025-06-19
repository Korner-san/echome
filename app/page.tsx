"use client"

import { MicIcon, BrainIcon, BarChart3Icon, UserIcon, XIcon, CheckIcon, BookOpenIcon, LogOutIcon } from "lucide-react"
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
  "איך אתה באמת מרגיש היום?",
  "אני כאן כדי להקשיב ולהדריך אותך — בקצב שלך.",
  "אני כאן כדי ללוות אותך במסע ההתפתחות שלך.",
  "על מה היית רוצה להרהר היום?"
]

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
  const router = useRouter()
  
  const { isRecording, transcript, startRecording, stopRecording, error } = useVoiceRecording()

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
        body: JSON.stringify({ message }),
      })

      console.log('API Response status:', response.status)
      const data = await response.json()
      console.log('API Response data:', data)

      if (response.ok) {
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
        if (data.hasTask && data.taskTitle) {
          const task: JournalTask = {
            id: Date.now().toString(),
            title: data.taskTitle,
            content: data.reply.length > 150 ? data.reply.substring(0, 150) + '...' : data.reply,
            urgency: determineUrgency(data.reply),
            date: new Date(),
            completed: false
          }
          
          // Save to localStorage for now (will be replaced with proper storage later)
          if (typeof window !== 'undefined') {
            try {
              const existingTasks = JSON.parse(localStorage.getItem('journalTasks') || '[]')
              localStorage.setItem('journalTasks', JSON.stringify([...existingTasks, task]))
            } catch (error) {
              console.error('Error saving task to localStorage:', error)
            }
          }
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
            <span className="text-xs text-[#E0D6F0]">{user?.email}</span>
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

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#2F2F3A]/30 backdrop-blur-sm p-5 mb-6">
          <div className="flex flex-col gap-4">
            {/* Third message */}
            {(completedTexts[2] || (currentMessageIndex === 2 && currentText)) && (
              <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-2xl rounded-tr-sm p-4 text-right">
                {completedTexts[2] || currentText}
              </div>
            )}
            
            {/* Fourth message */}
            {(completedTexts[3] || (currentMessageIndex === 3 && currentText)) && (
              <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-2xl rounded-tr-sm p-4 text-right">
                {completedTexts[3] || currentText}
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
                {isRecording ? "Recording... Click to stop" : isProcessing ? "Processing..." : "Click to speak"}
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

      {/* Bottom Tab Bar - Updated Order: Journal, Growth, Chat, Progress, Profile */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">Journal</span>
          </Link>
          <Link href="/growth" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BrainIcon size={24} />
            <span className="text-xs font-medium">Growth</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
            <MicIcon size={24} />
            <span className="text-xs font-medium">Chat</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BarChart3Icon size={24} />
            <span className="text-xs font-medium">Progress</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <UserIcon size={24} />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
