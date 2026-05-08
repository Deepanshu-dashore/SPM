import { FolderKanban, Shield, Activity, Plus, ShieldCheck, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-neutral-500 mt-2">Welcome back. Your vaults are secure.</p>
        </div>
        <Link 
          href="/dashboard/projects/new" 
          className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-2xl transition-all duration-300 shadow-xl"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { label: "Active Vaults", value: "12", icon: <FolderKanban className="w-5 h-5" />, trend: "Updated 2h ago" },
          { label: "Total Secrets", value: "148", icon: <Shield className="w-5 h-5" />, trend: "AES-256 Validated" },
          { label: "Security Status", value: "Optimal", icon: <ShieldCheck className="w-5 h-5" />, trend: "Zero breaches" },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:bg-neutral-800/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-neutral-800 border border-white/5 rounded-2xl flex items-center justify-center text-white shadow-lg">
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">{stat.trend}</span>
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Projects / Activity */}
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
            <Link href="/dashboard/projects" className="text-xs font-bold text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
              View All Vaults
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { name: "Frontend Production", secrets: 24, updated: "2h ago", icon: "F" },
              { name: "API Service - Beta", secrets: 8, updated: "1d ago", icon: "A" },
              { name: "Mobile App Config", secrets: 15, updated: "3d ago", icon: "M" },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-neutral-900/20 border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-neutral-800 border border-white/5 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                    {project.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{project.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">{project.secrets} variables • Updated {project.updated}</p>
                  </div>
                </div>
                <Link href="/dashboard/projects" className="p-3 bg-neutral-900 border border-white/5 rounded-xl text-neutral-600 group-hover:text-white hover:bg-neutral-800 transition-all shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Timeline</h2>
            <Activity className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="bg-neutral-900/10 border border-white/5 p-8 rounded-[2.5rem] relative">
            <div className="absolute left-10 top-12 bottom-12 w-[1px] bg-neutral-800"></div>
            <div className="space-y-10 relative">
              {[
                { action: "Key Accessed", meta: "DATABASE_URL revealed", time: "10m ago", color: "bg-emerald-500" },
                { action: "Session Refresh", meta: "New JWT token issued", time: "2h ago", color: "bg-blue-500" },
                { action: "Vault Initialized", meta: "Project 'Internal' created", time: "5h ago", color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 pl-1">
                  <div className={`relative z-10 w-3 h-3 mt-1.5 rounded-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] outline outline-4 outline-neutral-950`}></div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.action}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.meta}</p>
                    <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest mt-2">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
