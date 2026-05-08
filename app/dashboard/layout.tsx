"use client"

import { Lock, LayoutDashboard, FolderKanban, Shield, History, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", href: "/dashboard" },
    { icon: <FolderKanban className="w-4 h-4" />, label: "Projects", href: "/dashboard/projects" },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md z-40 flex items-center justify-between px-6">
        <Link href="/dashboard">
          <Image 
            src="/logo.png" 
            alt="VaultX" 
            width={100} 
            height={30} 
            className="brightness-110"
          />
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-[#09090B] flex flex-col z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <Link href="/dashboard" className="hidden lg:flex items-center mb-12 px-2">
            <Image 
              src="/logo.png" 
              alt="VaultX" 
              width={130} 
              height={40} 
              className="brightness-110"
              priority
            />
          </Link>

          {/* User Info in Sidebar (Mobile) */}
          <div className="lg:hidden flex items-center gap-4 mb-10 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name || "User"}</p>
              <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
              >
                <span className="group-hover:text-purple-400 transition-colors">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="hidden lg:flex items-center gap-3 mb-8 px-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name || "User"}</p>
              <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 w-full px-4 py-3 text-sm font-bold text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative lg:pt-0 pt-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
        <div className="p-6 md:p-10 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
