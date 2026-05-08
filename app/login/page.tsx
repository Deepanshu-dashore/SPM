"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import Image from "next/image"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const masterKey = formData.get("masterKey") as string

    const result = await signIn("credentials", {
      email,
      password,
      masterKey,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials or master key. Verification failed.")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 via-transparent to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center mb-4 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="VaultX" 
                width={200} 
                height={60} 
                className="brightness-110 group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute -inset-10 bg-purple-600/10 blur-3xl rounded-full -z-10 group-hover:bg-purple-600/20 transition-colors" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-4">Access Your Vault</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to unlock your secure space.</p>
        </div>

        <div className="bg-neutral-900/40 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -z-10" />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-400/5 border border-red-400/10 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 focus:outline-none focus:border-purple-500/30 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Account Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 focus:outline-none focus:border-purple-500/30 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Master Vault Key</label>
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                <input
                  name="masterKey"
                  type="password"
                  placeholder="Unlock encrypted secrets"
                  className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 focus:outline-none focus:border-purple-500/30 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-neutral-600 text-xs font-medium">
              Don't have a vault?{" "}
              <Link href="/signup" className="text-white hover:text-purple-400 transition-colors font-bold underline-offset-8 underline decoration-white/5">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
