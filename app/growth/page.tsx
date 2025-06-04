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

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#2F2F3A]/80 backdrop-blur-md">
        <div className="flex justify-around items-center h-full px-4">
          {[
            { icon: BrainIcon, label: "Growth", active: true, path: "/growth" },
            { icon: BookOpenIcon, label: "Journal", active: false, path: "/journal" },
            { icon: MicIcon, label: "Voice", active: false, path: "/" },
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
