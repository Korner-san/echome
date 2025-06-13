import {
  ArrowLeftIcon,
  BrainIcon,
  MicIcon,
  BarChart3Icon,
  UserIcon,
  Settings,
  Bell,
  Moon,
  HelpCircle,
  BookOpenIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ProfilePage() {
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
        <h1 className="text-2xl font-medium text-[#E0D6F0]">Your Profile</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100%-12rem)] px-6 pb-4 overflow-y-auto space-y-10">
        {/* Profile Header */}
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0D6F0] to-[#C5DCF0] flex items-center justify-center mr-5 shadow-[0_0_20px_rgba(224,214,240,0.5)]">
            <div className="w-22 h-22 rounded-full bg-[#2F2F3A]/30 flex items-center justify-center">
              <UserIcon size={36} className="text-[#2F2F3A]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#FAFAFA] mb-1">Alex Morgan</h2>
            <p className="text-sm text-[#FAFAFA]/70 mb-2">Member since May 2025</p>
            <div className="px-3 py-1.5 bg-[#C8E8D5]/30 rounded-md inline-block">
              <span className="text-xs font-medium text-[#C8E8D5]">Growth Level 4</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div>
          <h2 className="text-xl font-medium mb-4 text-[#FAFAFA]">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#E0D6F0] mb-1">28</p>
              <p className="text-xs text-[#FAFAFA]/70">Sessions</p>
            </div>
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#C5DCF0] mb-1">12h</p>
              <p className="text-xs text-[#FAFAFA]/70">Total Time</p>
            </div>
            <div className="bg-[#2F2F3A]/70 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#C8E8D5] mb-1">5</p>
              <p className="text-xs text-[#FAFAFA]/70">Streaks</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-xl font-medium mb-5 text-[#FAFAFA]">Settings</h2>
          <div className="space-y-4 bg-[#2F2F3A]/70 rounded-xl p-4 shadow-sm">
            {[
              { icon: Settings, label: "App Settings" },
              { icon: Bell, label: "Notifications" },
              { icon: Moon, label: "Appearance" },
              { icon: HelpCircle, label: "Help & Support" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-[#5A5D7C]/40 rounded-xl shadow-sm hover:bg-[#5A5D7C]/50 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full bg-[#FAFAFA]/15 flex items-center justify-center mr-4 shadow-inner">
                  <item.icon size={20} className="text-[#FAFAFA]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#FAFAFA]">{item.label}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAFAFA]/15 flex items-center justify-center">
                  <ArrowLeftIcon size={16} className="text-[#FAFAFA] rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-gradient-to-r from-[#E0D6F0] to-[#C5DCF0] rounded-xl p-5 shadow-[0_0_25px_rgba(224,214,240,0.3)]">
          <h3 className="text-[#2F2F3A] font-medium text-lg mb-2">Premium Membership</h3>
          <p className="text-[#2F2F3A]/90 text-sm mb-4 leading-relaxed">
            Unlock all growth paths and features for deeper self-reflection
          </p>
          <button className="bg-[#2F2F3A] text-[#FAFAFA] rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-[#2F2F3A]/90 transition-all duration-200">
            Upgrade Now
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
          <Link href="/" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <MicIcon size={24} />
            <span className="text-xs font-medium">Chat</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-[#FAFAFA]/60 hover:text-[#FAFAFA] transition-colors">
            <BarChart3Icon size={24} />
            <span className="text-xs font-medium">Progress</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 bg-[#E0D6F0]/20 text-[#E0D6F0] rounded-lg px-3 py-2">
            <UserIcon size={24} />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
