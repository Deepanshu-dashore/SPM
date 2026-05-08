"use client"

import { signup } from "@/actions/auth"
import Link from "next/link"
import { Lock, User, Mail, ShieldCheck, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center neon-glow group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tighter text-white">VaultX</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Your Vault</h1>
          <p className="text-gray-400 mt-2 text-sm">Initialize your secure workspace in seconds.</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem]">
          <form 
            action={async (formData) => {
              setLoading(true)
              try {
                await signup(formData)
              } catch (err) {
                alert(err instanceof Error ? err.message : "Signup failed")
                setLoading(false)
              }
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Account Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Master Vault Key</label>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    Encrypted
                  </div>
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500/70 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    name="masterKey"
                    type="password"
                    placeholder="A separate key for your data"
                    className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-500 leading-tight ml-1 mt-2 max-w-[90%]">
                  This key is <span className="text-white italic">never</span> stored. It's used solely to derive your local encryption key.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all neon-glow flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Initialize Your Vault
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-gray-500 text-sm">
              Already have a vault?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
