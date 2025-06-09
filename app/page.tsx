"use client"

import { MicIcon, BrainIcon, BarChart3Icon, UserIcon, XIcon, CheckIcon, BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { useVoiceRecording } from "@/hooks/useVoiceRecording"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "אני כאן כדי ללוות אותך במסע ההתפתחות שלך.",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '2', 
      content: "על מה היית רוצה להרהר היום?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { isRecording, transcript, startRecording, stopRecording, error } = useVoiceRecording()

  const handleVoiceButtonClick = async () => {
    if (isRecording) {
      console.log('Stopping recording...')
      const finalTranscript = await stopRecording()
      
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
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA]">
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

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-8rem)] px-6 pt-6 pb-4">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#E0D6F0] mb-2">איך אתה באמת מרגיש היום?</h1>
          <h2 className="text-xl font-light text-[#FAFAFA]">אני כאן כדי להקשיב ולהדריך אותך — בקצב שלך.</h2>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#2F2F3A]/30 backdrop-blur-sm p-5 mb-6">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.isUser
                    ? "self-end bg-[#C8E8D5]/90 text-[#2F2F3A] rounded-tr-sm"
                    : "self-start bg-[#5A5D7C]/95 text-[#FAFAFA] rounded-tl-sm"
                )}
              >
                {message.content}
              </div>
            ))}
            
            {/* Show current transcript while recording */}
            {isRecording && transcript && (
              <div className="self-end max-w-[80%] bg-[#E0D6F0]/70 text-[#2F2F3A] rounded-2xl rounded-tr-sm p-4 opacity-75">
                {transcript}
              </div>
            )}
            
            {/* Processing indicator */}
            {isProcessing && (
            <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 rounded-2xl rounded-tl-sm p-4 text-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-[#E0D6F0] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
            </div>
            )}
            
            {/* Error display */}
            {error && (
              <div className="self-center max-w-[80%] bg-red-500/20 text-red-200 rounded-2xl p-4 text-sm">
                {error}
            </div>
            )}
          </div>
        </div>

        {/* Voice Input Area */}
        <div className="relative flex justify-center items-center mb-10">
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
                ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 scale-110" 
                : "bg-gradient-to-br from-[#C5DCF0] via-[#E0D6F0] to-[#FADDE3]",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200",
              isRecording 
                ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700" 
                : "bg-gradient-to-br from-[#C5DCF0] via-[#FADDE3] to-[#C8E8D5]"
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

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#2F2F3A]/80 backdrop-blur-md">
        <div className="flex justify-around items-center h-full px-4">
          {[
            { icon: BrainIcon, label: "Growth", active: false, path: "/growth" },
            { icon: BookOpenIcon, label: "Journal", active: false, path: "/journal" },
            { icon: MicIcon, label: "Voice", active: true, path: "/" },
            { icon: BarChart3Icon, label: "Progress", active: false, path: "/progress" },
            { icon: UserIcon, label: "Profile", active: false, path: "/profile" },
          ].map((tab, index) => {
            // Make the Voice tab special
            if (tab.label === "Voice") {
              return (
                <Link
                  key={index}
                  href={tab.path}
                  className={cn(
                    "flex flex-col items-center justify-center -mt-6",
                    "w-16 h-16 rounded-full bg-gradient-to-br from-[#C5DCF0] via-[#E0D6F0] to-[#FADDE3]",
                    "shadow-[0_0_20px_rgba(224,214,240,0.6)]",
                  )}
                >
                  <tab.icon size={24} className="text-[#2F2F3A]" />
                  <span className="sr-only">Voice</span>
                </Link>
              )
            }

            return (
              <Link
                key={index}
                href={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 transition-all duration-200",
                  tab.active ? "text-[#E0D6F0]" : "text-[#FAFAFA]/50 hover:text-[#FAFAFA]/80",
                )}
              >
                <tab.icon size={22} className={cn("mb-1", tab.active && "drop-shadow-glow")} />
                <span className={cn("text-xs font-medium", tab.active ? "opacity-100" : "opacity-70")}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
