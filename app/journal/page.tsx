"use client"

import { useState, useEffect } from "react"
import { BookOpenIcon, CheckIcon, ClockIcon, AlertTriangleIcon, CalendarIcon, MicIcon, TrophyIcon, BarChart3Icon, UserIcon, ArrowUpDownIcon, LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface JournalTask {
  id: string
  title: string
  content: string
  urgency: 'מאוד חשוב' | 'חשוב' | 'אפשר לחכות' | 'מתי שתרצה'
  date: Date
  completed: boolean
}

const urgencyConfig = {
  'מאוד חשוב': { color: 'bg-red-500/20 text-red-200 border-red-500/30', icon: AlertTriangleIcon },
  'חשוב': { color: 'bg-orange-500/20 text-orange-200 border-orange-500/30', icon: ClockIcon },
  'אפשר לחכות': { color: 'bg-blue-500/20 text-blue-200 border-blue-500/30', icon: CalendarIcon },
  'מתי שתרצה': { color: 'bg-green-500/20 text-green-200 border-green-500/30', icon: CheckIcon }
}

export default function Journal() {
  const [tasks, setTasks] = useState<JournalTask[]>([])
  const [celebratingTaskId, setCelebratingTaskId] = useState<string | null>(null)
  const [celebrationStage, setCelebrationStage] = useState<'gif' | 'static' | null>(null)
  const [isPrioritizing, setIsPrioritizing] = useState(false)

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('journalTasks')
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          title: task.title || 'משימה', // Backward compatibility for tasks without titles
          date: new Date(task.date)
        }))
        setTasks(parsedTasks)
        console.log('Loaded tasks from localStorage:', parsedTasks)
      } catch (error) {
        console.error('Error loading tasks:', error)
        setTasks([])
      }
    }
  }, [])

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('journalTasks', JSON.stringify(updatedTasks))
    
    // Show two-stage celebration if task is being completed
    const task = tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      console.log('Starting celebration for task:', task.title)
      setCelebratingTaskId(taskId)
      setCelebrationStage('gif')
      
      // Stage 1: Show gif for ~1 second (let gif play)
      setTimeout(() => {
        console.log('Switching to static stage')
        setCelebrationStage('static')
      }, 1000)
      
      // Stage 2: Show static image for 2 seconds, then hide everything
      setTimeout(() => {
        console.log('Hiding celebration')
        setCelebratingTaskId(null)
        setCelebrationStage(null)
      }, 3000) // Total: 1s gif + 2s static = 3s total
    }
  }

  const groupTasksByDate = (tasks: JournalTask[]) => {
    const grouped: { [key: string]: JournalTask[] } = {}
    
    tasks.forEach(task => {
      const dateKey = task.date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(task)
    })
    
    return grouped
  }

  const handlePrioritizeTasks = async () => {
    if (tasks.length === 0 || isPrioritizing) return
    
    setIsPrioritizing(true)
    
    try {
      console.log('Starting task prioritization...')
      
      const response = await fetch('/api/prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to prioritize tasks')
      }
      
      const result = await response.json()
      console.log('Prioritization result:', result)
      
      if (result.success && result.prioritizedTasks) {
        // Update tasks with new urgency levels
        const updatedTasks = tasks.map(task => {
          const prioritizedTask = result.prioritizedTasks.find((pt: any) => pt.id === task.id)
          if (prioritizedTask) {
            return { ...task, urgency: prioritizedTask.newUrgency as JournalTask['urgency'] }
          }
          return task
        })
        
        // Sort tasks by urgency priority
        const urgencyOrder = ['מאוד חשוב', 'חשוב', 'אפשר לחכות', 'מתי שתרצה']
        const sortedTasks = updatedTasks.sort((a, b) => {
          const aIndex = urgencyOrder.indexOf(a.urgency)
          const bIndex = urgencyOrder.indexOf(b.urgency)
          return aIndex - bIndex
        })
        
        setTasks(sortedTasks)
        localStorage.setItem('journalTasks', JSON.stringify(sortedTasks))
        
        console.log('Tasks successfully prioritized and sorted')
      }
    } catch (error) {
      console.error('Error prioritizing tasks:', error)
    } finally {
      setIsPrioritizing(false)
    }
  }

  const groupedTasks = groupTasksByDate(tasks)
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => 
    new Date(groupedTasks[b][0].date).getTime() - new Date(groupedTasks[a][0].date).getTime()
  )

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA]">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full border border-[#FAFAFA] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C8E8D5] rounded-full"></div>
          </div>
          <div className="text-xs">85%</div>
        </div>
        <div className="text-sm font-medium">9:41</div>
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpenIcon size={32} className="text-[#E0D6F0]" />
            <h1 className="text-3xl font-medium text-[#E0D6F0]">יומן משימות</h1>
          </div>
          
          {/* Prioritize Button */}
          {tasks.length > 0 && (
            <button
              onClick={handlePrioritizeTasks}
              disabled={isPrioritizing}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200",
                isPrioritizing
                  ? "bg-[#5A5D7C]/30 border-[#5A5D7C]/50 text-[#FAFAFA]/50 cursor-not-allowed"
                  : "bg-[#E0D6F0]/20 border-[#E0D6F0]/30 text-[#E0D6F0] hover:bg-[#E0D6F0]/30 hover:border-[#E0D6F0]/50"
              )}
            >
              {isPrioritizing ? (
                <LoaderIcon size={16} className="animate-spin" />
              ) : (
                <ArrowUpDownIcon size={16} />
              )}
              <span className="text-sm font-medium">
                {isPrioritizing ? 'מתעדף...' : 'תתעדף לי משימות'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tasks Content */}
      <div className="px-6 pb-32">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BookOpenIcon size={64} className="text-[#5A5D7C] mb-4" />
            <h2 className="text-xl font-medium text-[#E0D6F0] mb-2">אין משימות עדיין</h2>
            <p className="text-[#FAFAFA]/70">משימות יישמרו כאן אוטומטית כשהבינה המלאכותית תזהה אותן בשיחות</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="space-y-3">
                <h2 className="text-lg font-medium text-[#E0D6F0] border-b border-[#5A5D7C]/50 pb-2">
                  {date}
                </h2>
                <div className="space-y-3">
                  {groupedTasks[date].map(task => {
                    const urgencyStyle = urgencyConfig[task.urgency]
                    const UrgencyIcon = urgencyStyle.icon
                    
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "bg-[#2F2F3A]/50 backdrop-blur-sm rounded-xl p-4 border border-[#5A5D7C]/30 transition-all duration-200 relative",
                          task.completed && "opacity-60"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-1",
                              task.completed
                                ? "bg-[#C8E8D5] border-[#C8E8D5] text-[#2F2F3A]"
                                : "border-[#5A5D7C] hover:border-[#E0D6F0]"
                            )}
                          >
                            {task.completed && <CheckIcon size={14} />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {/* Two-Stage Celebration */}
                              {celebratingTaskId === task.id && (
                                <div className="flex-shrink-0">
                                  {celebrationStage === 'gif' && (
                                    <img 
                                      src="/celebration.gif" 
                                      alt="הצלחה!" 
                                      className="w-8 h-8 object-contain"
                                    />
                                  )}
                                  {celebrationStage === 'static' && (
                                    <img 
                                      src="/static TAK.png" 
                                      alt="הצלחה!" 
                                      className="w-8 h-8 object-contain"
                                      onLoad={() => console.log('Static image loaded successfully')}
                                      onError={(e) => {
                                        console.error('Failed to load static image:', e);
                                        // Fallback: try without space
                                        const img = e.target as HTMLImageElement;
                                        if (img.src.includes('static TAK.png')) {
                                          img.src = '/static_tak.png';
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                                urgencyStyle.color
                              )}>
                                <UrgencyIcon size={12} />
                                {task.urgency}
                              </span>
                            </div>
                            
                            {task.title && (
                              <h3 className={cn(
                                "text-[#E0D6F0] font-medium mb-2 text-lg",
                                task.completed && "line-through text-[#E0D6F0]/50"
                              )}>
                                {task.title}
                              </h3>
                            )}
                            
                            <p className={cn(
                              "text-[#FAFAFA]/80 leading-relaxed text-sm",
                              task.completed && "line-through text-[#FAFAFA]/30"
                            )}>
                              {task.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar - עברית מלאה */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10 z-50">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">יומן</span>
          </Link>
          <Link href="/growth" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <TrophyIcon size={24} />
            <span className="text-xs font-medium">הישגים</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
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
