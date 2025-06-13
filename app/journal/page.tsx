"use client"

import { useState, useEffect } from "react"
import { BookOpenIcon, CheckIcon, ClockIcon, AlertTriangleIcon, CalendarIcon, MicIcon, BrainIcon, BarChart3Icon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface JournalTask {
  id: string
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

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('journalTasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date)
      }))
      setTasks(parsedTasks)
    }
  }, [])

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('journalTasks', JSON.stringify(updatedTasks))
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

  const groupedTasks = groupTasksByDate(tasks)
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => 
    new Date(groupedTasks[b][0].date).getTime() - new Date(groupedTasks[a][0].date).getTime()
  )

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
        <div className="text-sm font-medium">9:41</div>
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <BookOpenIcon size={32} className="text-[#E0D6F0]" />
          <h1 className="text-3xl font-medium text-[#E0D6F0]">יומן משימות</h1>
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
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
                          "bg-[#2F2F3A]/50 backdrop-blur-sm rounded-xl p-4 border border-[#5A5D7C]/30 transition-all duration-200",
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
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                                urgencyStyle.color
                              )}>
                                <UrgencyIcon size={12} />
                                {task.urgency}
                              </span>
                            </div>
                            
                            <p className={cn(
                              "text-[#FAFAFA] leading-relaxed",
                              task.completed && "line-through text-[#FAFAFA]/50"
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

             {/* Bottom Tab Bar - Updated Order: Journal, Growth, Chat, Progress, Profile */}
       <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
         <div className="flex justify-around items-center py-3 px-6">
           <Link href="/journal" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
             <BookOpenIcon size={24} />
             <span className="text-xs font-medium">Journal</span>
           </Link>
           <Link href="/growth" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
             <BrainIcon size={24} />
             <span className="text-xs font-medium">Growth</span>
           </Link>
           <Link href="/" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
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
