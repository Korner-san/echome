import { ArrowLeftIcon, TrophyIcon, MicIcon, BarChart3Icon, UserIcon, BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ProgressPage() {
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
        <h1 className="text-2xl font-medium text-[#E0D6F0]">מסע ההתפתחות שלך</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-12rem)] px-6 pb-4 overflow-y-auto space-y-10">
        {/* Weekly Overview */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-medium text-[#FAFAFA]">סקירה שבועית</h2>
            <div className="text-xs font-medium px-2.5 py-1 bg-[#C8E8D5]/30 rounded-full text-[#C8E8D5]">
              +15% מהשבוע שעבר
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 bg-[#2F2F3A]/50 rounded-xl p-4 relative">
            <div className="absolute bottom-4 left-4 right-4 h-32">
              {/* Simplified chart visualization */}
              <div className="relative h-full w-full flex items-end justify-between">
                {["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"].map((day, index) => {
                  // Generate random heights for the bars
                  const heights = [45, 65, 40, 80, 60, 90, 75]
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-6 rounded-t-md bg-gradient-to-t from-[#C5DCF0] to-[#E0D6F0]"
                        style={{ height: `${heights[index]}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-[#FAFAFA]/80">{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Insights */}
        <div>
          <h2 className="text-xl font-medium mb-5 text-[#FAFAFA]">תובנות התפתחות</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-[#2F2F3A]/70 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#FAFAFA]">זמן מיקוד</h3>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8E8D5] to-[#C5DCF0] flex items-center justify-center shadow-sm">
                  <BarChart3Icon size={16} className="text-[#2F2F3A]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#C8E8D5]">2 שעות 15 דק'</p>
              <p className="text-xs text-[#FAFAFA]/70 mt-1">השבוע</p>
            </div>
            <div className="bg-[#2F2F3A]/70 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#FAFAFA]">שיחות</h3>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FADDE3] to-[#E0D6F0] flex items-center justify-center shadow-sm">
                  <MicIcon size={16} className="text-[#2F2F3A]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#FADDE3]">12</p>
              <p className="text-xs text-[#FAFAFA]/70 mt-1">השבוע</p>
            </div>
          </div>
        </div>

        {/* Growth Areas */}
        <div>
          <h2 className="text-xl font-medium mb-5 text-[#FAFAFA]">תחומי התפתחות</h2>
          <div className="space-y-5 bg-[#2F2F3A]/70 rounded-xl p-5 shadow-sm">
            {[
              { area: "אינטליגנציה רגשית", progress: 75, color: "from-[#E0D6F0] to-[#FADDE3]" },
              { area: "מיינדפולנס", progress: 60, color: "from-[#C5DCF0] to-[#C8E8D5]" },
              { area: "ניהול לחץ", progress: 45, color: "from-[#C8E8D5] to-[#E0D6F0]" },
            ].map((item, index) => (
              <div key={index} className="bg-[#5A5D7C]/40 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-[#FAFAFA]">{item.area}</h3>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full bg-[#5A5D7C]/50 
            ${item.progress > 70 ? "text-[#C8E8D5]" : item.progress > 50 ? "text-[#C5DCF0]" : "text-[#FADDE3]"}`}
                  >
                    {item.progress}%
                  </span>
                </div>
                <div className="h-2.5 bg-[#FAFAFA]/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar - עברית מלאה */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
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
          <Link href="/progress" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
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
