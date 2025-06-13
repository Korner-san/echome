import { ArrowLeftIcon, BrainIcon, MicIcon, BarChart3Icon, UserIcon, BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function GrowthPage() {
  const growthCategories = [
    {
      title: "Deep Reflection",
      description: "12:25 Min",
      color: "from-[#C5DCF0] to-[#E0D6F0]",
      level: 1,
    },
    {
      title: "Focus of Mind",
      description: "17:30 Min",
      color: "from-[#C8E8D5] to-[#C5DCF0]",
      level: 2,
    },
    {
      title: "Emotional Balance",
      description: "15:45 Min",
      color: "from-[#FADDE3] to-[#E0D6F0]",
      level: 1,
    },
    {
      title: "Clarity Path",
      description: "20:10 Min",
      color: "from-[#E0D6F0] to-[#C8E8D5]",
      level: 3,
    },
  ]

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
        <h1 className="text-2xl font-medium text-[#E0D6F0]">Growth Paths</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-12rem)] px-6 pb-4 overflow-y-auto space-y-8">
        <p className="text-[#FAFAFA]/90 text-sm leading-relaxed">
          Select a growth path to begin your journey of self-discovery and improvement
        </p>

        {/* Growth Categories Grid */}
        <div>
          <h2 className="text-xl font-medium mb-4 text-[#FAFAFA]">Explore Paths</h2>
          <div className="grid grid-cols-2 gap-5">
            {growthCategories.map((category, index) => (
              <div key={index} className="flex flex-col">
                <div
                  className={`h-36 rounded-xl bg-gradient-to-br ${category.color} p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(224,214,240,0.2)]`}
                >
                  <div className="bg-[#2F2F3A]/30 rounded-md px-2.5 py-1 self-start backdrop-blur-sm">
                    <span className="text-xs font-medium text-[#FAFAFA]">Level {category.level}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-[#2F2F3A]">{category.title}</h3>
                    <p className="text-xs text-[#2F2F3A]/90">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-xl font-medium mb-4 text-[#FAFAFA]">Recent Sessions</h2>
          <div className="space-y-4 bg-[#2F2F3A]/70 rounded-xl p-4 shadow-sm">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-[#5A5D7C]/40 rounded-xl hover:bg-[#5A5D7C]/50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E0D6F0] to-[#C5DCF0] flex items-center justify-center mr-4 shadow-sm">
                  <BrainIcon size={20} className="text-[#2F2F3A]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1 text-[#FAFAFA]">Morning Reflection</h3>
                  <p className="text-xs text-[#FAFAFA]/70">Yesterday • 15 min</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAFAFA]/15 flex items-center justify-center">
                  <ArrowLeftIcon size={16} className="text-[#FAFAFA] rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar - Updated Order: Journal, Growth, Chat, Progress, Profile */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2F2F3A]/95 backdrop-blur-md border-t border-[#FAFAFA]/10">
        <div className="flex justify-around items-center py-3 px-6">
          <Link href="/journal" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BookOpenIcon size={24} />
            <span className="text-xs font-medium">Journal</span>
          </Link>
          <Link href="/growth" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
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
