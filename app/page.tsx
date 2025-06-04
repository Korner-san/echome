import { MicIcon, BrainIcon, BarChart3Icon, UserIcon, XIcon, CheckIcon, BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Home() {
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
          <h1 className="text-3xl font-medium text-[#E0D6F0] mb-2">How are you really feeling today?</h1>
          <h2 className="text-xl font-light text-[#FAFAFA]">I'm here to listen and guide you — at your pace.</h2>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#2F2F3A]/30 backdrop-blur-sm p-5 mb-6">
          <div className="flex flex-col gap-4">
            <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 rounded-2xl rounded-tl-sm p-4 text-[#FAFAFA]">
              I'm here to support your growth journey.
            </div>
            <div className="self-start max-w-[80%] bg-[#5A5D7C]/95 rounded-2xl rounded-tl-sm p-4 text-[#FAFAFA]">
              What would you like to reflect on today?
            </div>
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C5DCF0] via-[#E0D6F0] to-[#FADDE3] flex items-center justify-center shadow-[0_0_8px_rgba(224,214,240,0.3)] relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C5DCF0] via-[#FADDE3] to-[#C8E8D5] flex items-center justify-center">
              <MicIcon size={32} className="text-[#2F2F3A]" />
            </div>
          </div>

          <div className="absolute -bottom-10 text-center">
            <p className="text-[#FAFAFA] text-sm font-medium tracking-wide">Hold to speak</p>
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
