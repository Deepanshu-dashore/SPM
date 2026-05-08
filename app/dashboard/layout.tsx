import { Lock, LayoutDashboard, FolderKanban, Shield, History, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

import Image from "next/image"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#09090B] flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center mb-12 px-2">
            <Image 
              src="/logo.png" 
              alt="VaultX" 
              width={130} 
              height={40} 
              className="brightness-110"
              priority
            />
          </Link>

          <nav className="space-y-1">
            {[
              { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", href: "/dashboard" },
              { icon: <FolderKanban className="w-4 h-4" />, label: "Projects", href: "/dashboard/projects" },
              { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
              >
                <span className="group-hover:text-purple-400 transition-colors">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || "User"}</p>
              <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="p-10 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
