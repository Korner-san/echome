import { ArrowLeftIcon, BrainIcon, MicIcon, BarChart3Icon, UserIcon, BookOpenIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function JournalPage() {
  const journalEntries = [
    {
      title: "Morning Reflection",
      date: "Today, 8:45 AM",
      preview:
        "I woke up feeling refreshed today. My mind was clear and I felt ready to tackle the challenges ahead...",
      mood: "Positive",
      color: "from-[#C8E8D5] to-[#C5DCF0]",
    },
    {
      title: "Work Stress",
      date: "Yesterday, 6:30 PM",
      preview:
        "The project deadline is approaching and I'm feeling the pressure. I need to find better ways to manage my time...",
      mood: "Stressed",
      color: "from-[#FADDE3] to-[#E0D6F0]",
    },
    {
      title: "Weekend Plans",
      date: "May 18, 2:15 PM",
      preview: "Looking forward to the weekend. I'm planning to take some time for myself and practice mindfulness...",
      mood: "Hopeful",
      color: "from-[#E0D6F0] to-[#C5DCF0]",
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
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeftIcon size={24} className="text-[#FAFAFA]" />
          </Link>
          <h1 className="text-2xl font-medium text-[#E0D6F0]">Your Reflections</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E0D6F0] to-[#C5DCF0] flex items-center justify-center shadow-[0_0_15px_rgba(224,214,240,0.5)]">
          <PlusIcon size={20} className="text-[#2F2F3A]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-12rem)] px-6 pb-4 overflow-y-auto">
        <p className="text-[#FAFAFA]/80 mb-8 text-sm">Your personal space for reflection and growth</p>

        {/* Journal Entries */}
        <div className="space-y-5 mb-10">
          <h2 className="text-xl font-medium text-[#FAFAFA] mb-2">Recent Entries</h2>
          {journalEntries.map((entry, index) => {
            // Define mood-specific colors - brighter and more welcoming
            const moodColors = {
              Positive: "from-[#C8E8D5]/30 to-[#C8E8D5]/50 text-[#C8E8D5]",
              Stressed: "from-[#FADDE3]/30 to-[#FADDE3]/50 text-[#FADDE3]",
              Hopeful: "from-[#E0D6F0]/30 to-[#E0D6F0]/50 text-[#E0D6F0]",
            }

            const moodColor = moodColors[entry.mood] || "from-[#C5DCF0]/30 to-[#C5DCF0]/50 text-[#C5DCF0]"

            return (
              <div key={index} className="bg-[#2F2F3A]/50 rounded-xl overflow-hidden shadow-sm">
                <div className={`h-2 bg-gradient-to-r ${entry.color}`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-[#FAFAFA]">{entry.title}</h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${moodColor}`}>
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-xs text-[#FAFAFA]/70 mb-3">{entry.date}</p>
                  <p className="text-sm text-[#FAFAFA] line-clamp-2 leading-relaxed">{entry.preview}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Journal Insights */}
        <div className="mb-10">
          <h2 className="text-xl font-medium text-[#FAFAFA] mb-4">Your Insights</h2>
          <div className="bg-[#2F2F3A]/70 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#5A5D7C]/50 rounded-lg p-3.5">
                <p className="text-xs text-[#FAFAFA]/70 mb-1.5">Most frequent mood</p>
                <p className="text-sm font-medium text-[#E0D6F0]">Hopeful</p>
              </div>
              <div className="bg-[#5A5D7C]/50 rounded-lg p-3.5">
                <p className="text-xs text-[#FAFAFA]/70 mb-1.5">Journal streak</p>
                <p className="text-sm font-medium text-[#C8E8D5]">3 days</p>
              </div>
              <div className="bg-[#5A5D7C]/50 rounded-lg p-3.5">
                <p className="text-xs text-[#FAFAFA]/70 mb-1.5">Total entries</p>
                <p className="text-sm font-medium text-[#C5DCF0]">12</p>
              </div>
              <div className="bg-[#5A5D7C]/50 rounded-lg p-3.5">
                <p className="text-xs text-[#FAFAFA]/70 mb-1.5">Growth topics</p>
                <p className="text-sm font-medium text-[#FADDE3]">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Prompts */}
        <div className="bg-gradient-to-r from-[#5A5D7C] to-[#E0D6F0]/40 rounded-xl p-5 shadow-[0_0_25px_rgba(224,214,240,0.2)]">
          <h2 className="text-xl font-medium mb-3 text-[#FAFAFA]">Today's Prompt</h2>
          <p className="text-sm mb-4 leading-relaxed text-[#FAFAFA]">What small win are you celebrating today?</p>
          <button className="bg-[#FAFAFA]/15 hover:bg-[#FAFAFA]/25 text-[#FAFAFA] rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm">
            Write Now
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#2F2F3A]/80 backdrop-blur-md">
        <div className="flex justify-around items-center h-full px-4">
          {[
            { icon: BrainIcon, label: "Growth", active: false, path: "/growth" },
            { icon: BookOpenIcon, label: "Journal", active: true, path: "/journal" },
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
