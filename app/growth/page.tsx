"use client"

import { useState, useEffect } from "react"
import { ArrowLeftIcon, TrophyIcon, MicIcon, BarChart3Icon, UserIcon, BookOpenIcon, CheckIcon, LockIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

// Medal Display Component
const MedalDisplay = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-1 justify-end flex-row-reverse">
      {Array.from({ length: level }, (_, index) => (
        <img
          key={index}
          src="/medal.png"
          alt="מדליה"
          className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        />
      ))}
    </div>
  )
}

// Star Progress Component with Animation
const StarProgress = ({ completed, total }: { completed: number; total: number }) => {
  return (
    <div className="flex items-center gap-1 justify-end flex-row-reverse">
      {Array.from({ length: total }, (_, index) => (
        <img
          key={index}
          src="/star.png"
          alt="כוכב"
          className={cn(
            "w-5 h-5 object-contain transition-all duration-500 ease-in-out",
            index < completed 
              ? "opacity-100 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] scale-110 brightness-125" // Golden glow + scale for completed
              : "opacity-30 grayscale scale-90" // Faded, grayscale and smaller for incomplete
          )}
          style={{
            transitionDelay: index < completed ? `${index * 100}ms` : '0ms' // Staggered animation
          }}
        />
      ))}
    </div>
  )
}

interface TaskManagerLevel {
  id: string
  title: string
  description: string
  level: number // Medal level (1-5)
  isCompleted: boolean
  completedTasks: number
  totalTasks: number
  tasks: Task[]
}

interface Task {
  id: string
  name: string
  isCompleted: boolean
}

const TASK_MANAGER_LEVELS: TaskManagerLevel[] = [
  {
    id: 'beginner',
    title: 'מנהל משימות מתחיל',
    description: 'הצעדים הראשונים בניהול משימות',
    level: 1,
    isCompleted: false,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { id: 'create_5_tasks', name: 'צור 5 משימות', isCompleted: false },
      { id: 'complete_5_tasks', name: 'השלם 5 משימות', isCompleted: false },
      { id: 'login_5_days', name: 'התחבר לאפליקציה 5 ימים ברציפות', isCompleted: false },
      { id: 'career_tasks', name: 'צור 5 משימות הקשורות לשיפור המקצוע שלך', isCompleted: false },
      { id: 'hobby_tasks', name: 'צור 5 משימות הקשורות לתחביבים שלך', isCompleted: false }
    ]
  },
  {
    id: 'advanced',
    title: 'מנהל משימות מתקדם',
    description: 'פיתוח כישורי ניהול משימות מתקדמים',
    level: 2,
    isCompleted: false,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { id: 'complete_10_week', name: 'השלם 10 משימות בשבוע אחד', isCompleted: false },
      { id: 'future_tasks', name: 'צור 5 משימות עם תאריך יעד עתידי', isCompleted: false },
      { id: 'scheduled_tasks', name: 'השלם 5 משימות שתוזמנו ליום מסוים', isCompleted: false },
      { id: 'weekly_recurring', name: 'צור 3 משימות שתחוזרנה כל שבוע', isCompleted: false },
      { id: 'early_completion', name: 'סיים משימה אחת לפני הזמן שתכננת לה', isCompleted: false }
    ]
  },
  {
    id: 'experienced',
    title: 'מנהל משימות מנוסה',
    description: 'מיומנות גבוהה בארגון וניהול משימות',
    level: 3,
    isCompleted: false,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { id: 'daily_tasks_3_days', name: 'צור 3 משימות יומיות למשך 3 ימים רצופים', isCompleted: false },
      { id: 'complete_15_total', name: 'השלם 15 משימות בסך הכול', isCompleted: false },
      { id: 'detailed_task', name: 'צור משימה עם תיאור מפורט', isCompleted: false },
      { id: 'categorized_task', name: 'צור משימה שמוגדרת לפי קטגוריה או תגית', isCompleted: false },
      { id: 'edit_task_twice', name: 'ערוך משימה קיימת לפחות פעמיים', isCompleted: false }
    ]
  },
  {
    id: 'expert',
    title: 'מנהל משימות מומחה',
    description: 'רמה מקצועית של ניהול משימות',
    level: 4,
    isCompleted: false,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { id: 'custom_template', name: 'צור תבנית משימות מותאמת אישית', isCompleted: false },
      { id: 'all_categories', name: 'השלם משימות מכל ארבעת סוגי הקטגוריות באפליקציה (אישי, עבודה, למידה, תחביבים)', isCompleted: false },
      { id: 'bulk_create_10', name: 'צור 10 משימות בבת אחת', isCompleted: false },
      { id: 'complete_5_one_day', name: 'סיים 5 משימות תוך פחות מיום', isCompleted: false },
      { id: 'dependent_task', name: 'צור משימה תלויה במשימה אחרת', isCompleted: false }
    ]
  },
  {
    id: 'professor',
    title: 'פרופסור לניהול משימות',
    description: 'מומחיות מלאה וחדשנות בניהול משימות',
    level: 5,
    isCompleted: false,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { id: 'complete_30_total', name: 'השלם 30 משימות סה״כ', isCompleted: false },
      { id: 'login_10_days', name: 'התחבר לאפליקציה 10 ימים ברציפות', isCompleted: false },
      { id: 'task_automation', name: 'צור אוטומציה של משימות (למשתמשים שיש להם אפשרות)', isCompleted: false },
      { id: 'task_board_10', name: 'צור לוח משימות עם לפחות 10 משימות מתויגות', isCompleted: false },
      { id: 'team_tasks_3', name: 'צור 3 משימות צוות/משותפות', isCompleted: false }
    ]
  }
]

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [levels, setLevels] = useState<TaskManagerLevel[]>(TASK_MANAGER_LEVELS)
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        await loadUserProgress(currentUser.id)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  // Real-time updates for achievements
  useEffect(() => {
    if (user) {
      const refreshProgress = () => {
        loadUserProgress(user.id)
      }

      // Listen for storage changes (when achievements are updated)
      window.addEventListener('storage', refreshProgress)
      
      // Also refresh every 5 seconds to catch any missed updates
      const interval = setInterval(refreshProgress, 5000)

      return () => {
        window.removeEventListener('storage', refreshProgress)
        clearInterval(interval)
      }
    }
  }, [user])

  const loadUserProgress = async (userId: string) => {
    try {
      // טעינת התקדמות המשתמש מהמסד נתונים
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error loading achievements:', error)
        return
      }

      // חישוב מספר המשימות שנוצרו מ-localStorage
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const totalTasksCreated = storedTasks.length

      // עדכון מצב הרמות בהתאם להישגים
      const updatedLevels = levels.map(level => {
        // חישוב מספר המשימות שהושלמו לפי הישגים
        let completedTasks = 0
        let isCompleted = false

        // בדיקה לפי רמה
        switch (level.id) {
          case 'beginner':
            // חיפוש הישגים של מתחיל
            const beginnerAchievements = userAchievements?.filter(a => 
              ['first_task', 'task_master_2', 'task_master_3', 'task_master_4', 'task_master_5'].includes(a.achievement_name)
            ) || []
            // הכוכבים מבוססים על מספר המשימות שנוצרו (מקסימום 5)
            completedTasks = Math.min(totalTasksCreated, 5)
            isCompleted = beginnerAchievements.length >= 5
            break
            
          case 'advanced':
            // חיפוש הישגים של מתקדם
            const advancedAchievements = userAchievements?.filter(a => 
              ['task_master_6', 'task_master_7', 'task_master_8', 'task_master_9', 'task_master_10'].includes(a.achievement_name)
            ) || []
            // הכוכבים מבוססים על מספר המשימות מעבר ל-5 (מקסימום 5 כוכבים)
            completedTasks = Math.min(Math.max(totalTasksCreated - 5, 0), 5)
            isCompleted = advancedAchievements.length >= 5
            break
            
          case 'experienced':
            // חיפוש הישגים של מנוסה
            const experiencedAchievements = userAchievements?.filter(a => 
              a.achievement_name.includes('experienced')
            ) || []
            // הכוכבים מבוססים על מספר המשימות מעבר ל-10 (מקסימום 5 כוכבים)
            completedTasks = Math.min(Math.max(totalTasksCreated - 10, 0), 5)
            isCompleted = experiencedAchievements.length >= 5
            break
            
          case 'expert':
            // חיפוש הישגים של מומחה
            const expertAchievements = userAchievements?.filter(a => 
              a.achievement_name.includes('expert')
            ) || []
            // הכוכבים מבוססים על מספר המשימות מעבר ל-15 (מקסימום 5 כוכבים)
            completedTasks = Math.min(Math.max(totalTasksCreated - 15, 0), 5)
            isCompleted = expertAchievements.length >= 5
            break
            
          case 'professor':
            // חיפוש הישגים של פרופסור
            const professorAchievements = userAchievements?.filter(a => 
              a.achievement_name.includes('professor')
            ) || []
            // הכוכבים מבוססים על מספר המשימות מעבר ל-20 (מקסימום 5 כוכבים)
            completedTasks = Math.min(Math.max(totalTasksCreated - 20, 0), 5)
            isCompleted = professorAchievements.length >= 5
            break
            
          default:
            completedTasks = 0
            isCompleted = false
        }

        return {
          ...level,
          completedTasks,
          isCompleted
        }
      })

      setLevels(updatedLevels)
      console.log('User progress loaded and synced:', updatedLevels)
      
    } catch (error) {
      console.error('Error loading user progress:', error)
    }
  }

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(levelId)) {
        newSet.delete(levelId)
      } else {
        newSet.add(levelId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div dir="rtl" className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#5A5D7C] to-[#2F2F3A] text-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl">טוען הישגים...</div>
      </div>
    )
  }

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
      <div className="px-6 py-4 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <TrophyIcon size={32} className="text-[#E0D6F0]" />
          <h1 className="text-2xl font-medium text-[#E0D6F0]">הישגים</h1>
        </div>
        <Link href="/" className="ml-4">
          <ArrowLeftIcon size={24} className="text-[#FAFAFA]" />
        </Link>
      </div>

      {/* Task Manager Achievement System */}
      <div className="px-6 pb-32">
        <div className="mb-6 text-right">
          <h2 className="text-xl font-medium text-[#E0D6F0] mb-2">🎯 מנהל משימות</h2>
          <p className="text-sm text-[#FAFAFA]/70">התקדם דרך 5 דרגות של מיומנות בניהול משימות</p>
        </div>

        <div className="space-y-4">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={cn(
                "bg-[#2F2F3A]/50 backdrop-blur-sm rounded-xl border transition-all duration-300",
                level.isCompleted 
                  ? "border-[#C8E8D5]/50 shadow-[0_0_20px_rgba(200,232,213,0.3)]" 
                  : "border-[#5A5D7C]/30 opacity-70"
              )}
            >
              {/* Level Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleLevel(level.id)}
              >
                <div className="w-full text-right">
                  {/* Achievement Title - Right Aligned */}
                  <div className="flex items-center justify-end gap-2 mb-4">
                    {level.isCompleted && (
                      <CheckIcon size={20} className="text-[#C8E8D5]" />
                    )}
                    <h3 className={cn(
                      "text-lg font-medium",
                      level.isCompleted ? "text-[#C8E8D5]" : "text-[#FAFAFA]/50"
                    )}>
                      {level.title}
                    </h3>
                  </div>
                  
                  {/* Achievement Description - Right Aligned */}
                  <p className={cn(
                    "text-sm mb-4 text-right",
                    level.isCompleted ? "text-[#FAFAFA]/80" : "text-[#FAFAFA]/40"
                  )}>
                    {level.description}
                  </p>

                  {/* Show Tasks Button - Right Aligned */}
                  <div className="flex justify-start mb-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <span className="text-xs text-[#FAFAFA]/60">
                        {expandedLevels.has(level.id) ? 'הסתר משימות' : 'הצג משימות'}
                      </span>
                      {expandedLevels.has(level.id) ? (
                        <ChevronUpIcon size={16} className="text-[#FAFAFA]/60" />
                      ) : (
                        <ChevronDownIcon size={16} className="text-[#FAFAFA]/60" />
                      )}
                    </div>
                  </div>

                  {/* Stars Row - Right Aligned */}
                  <div className="flex justify-start mb-3">
                    <StarProgress completed={level.completedTasks} total={5} />
                  </div>
                  
                  {/* Medals Row - Right Aligned */}
                  <div className="flex justify-start">
                    <MedalDisplay level={level.level} />
                  </div>
                </div>
              </div>

              {/* Expanded Tasks List */}
              {expandedLevels.has(level.id) && (
                <div className="px-6 pb-6">
                  <div className="bg-[#2F2F3A]/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-[#E0D6F0] mb-3 text-right">משימות לביצוע:</h4>
                    <div className="space-y-3">
                      {level.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 justify-start">
                          <span className={cn(
                            "text-sm",
                            task.isCompleted 
                              ? "text-[#C8E8D5] line-through" 
                              : "text-[#FAFAFA]/80"
                          )}>
                            {task.name}
                          </span>
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                            task.isCompleted 
                              ? "bg-[#C8E8D5] border-[#C8E8D5]" 
                              : "border-[#FAFAFA]/30"
                          )}>
                            {task.isCompleted && (
                              <CheckIcon size={12} className="text-[#2F2F3A]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Progress Summary */}
        <div className="mt-8 bg-[#2F2F3A]/70 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4 text-[#E0D6F0] text-right">סיכום התקדמות</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FADDE3]">
                {levels.reduce((sum, level) => sum + level.totalTasks, 0)}
              </div>
              <div className="text-sm text-[#FAFAFA]/70">סה"כ משימות</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E0D6F0]">
                {levels.reduce((sum, level) => sum + level.completedTasks, 0)}
              </div>
              <div className="text-sm text-[#FAFAFA]/70">משימות הושלמו</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C8E8D5]">
                {levels.filter(l => l.isCompleted).length}
              </div>
              <div className="text-sm text-[#FAFAFA]/70">דרגות הושלמו</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10 z-50">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">יומן</span>
          </Link>
          <Link href="/growth" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
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
