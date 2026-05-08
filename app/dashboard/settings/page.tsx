"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight
} from "lucide-react"
import { updateUserSettings, updateUserPassword } from "@/actions/auth"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [passMessage, setPassMessage] = useState({ type: "", text: "" })

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateUserSettings(formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Update local session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.get("name"),
            email: formData.get("email"),
          }
        })
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPassLoading(true)
    setPassMessage({ type: "", text: "" })

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateUserPassword(formData)
      if (result.success) {
        setPassMessage({ type: "success", text: result.message })
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      setPassMessage({ type: "error", text: err.message || "Failed to update password" })
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and security settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Navigation for Settings (Internal) */}
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Password', icon: <Lock className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.id === 'profile' 
                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Profile Details</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                  />
                </div>
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all neon-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile Changes
              </button>
            </form>
          </motion.div>

          {/* Security Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Security & Password</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              {passMessage.text && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                  passMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {passMessage.text}
                </div>
              )}

              <button
                disabled={passLoading}
                type="submit"
                className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Account Password
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
