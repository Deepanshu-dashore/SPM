"use client"

import { useState, useEffect } from "react"
import { getSecrets, addSecret } from "@/actions/vault"
import { Lock, Eye, EyeOff, Copy, Plus, Loader2, ShieldAlert, Key, Search, ChevronLeft, Check, Activity, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [masterKey, setMasterKey] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [secrets, setSecrets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [error, setError] = useState("")
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const unlockVault = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await getSecrets(id as string, masterKey)
      setSecrets(data)
      setIsUnlocked(true)
    } catch (err) {
      setError("Invalid master key. Decryption failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSecret = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAddLoading(true)
    const formData = new FormData(e.currentTarget)
    const key = formData.get("key") as string
    const value = formData.get("value") as string

    try {
      await addSecret(id as string, masterKey, key, value)
      const data = await getSecrets(id as string, masterKey)
      setSecrets(data)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      alert("Failed to encrypt and save secret")
    } finally {
      setAddLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900/40 border border-white/5 p-12 rounded-[3rem] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10" />
          
          <div className="w-20 h-20 bg-neutral-800 border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Vault Locked</h1>
          <p className="text-neutral-500 mb-10 text-sm leading-relaxed">
            Your data is protected with AES-256-GCM. <br />
            Enter your Master Key to decrypt locally.
          </p>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <p className="text-xs text-red-400 bg-red-400/5 py-3 px-4 rounded-xl border border-red-400/10">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={unlockVault} className="space-y-4">
            <input
              type="password"
              placeholder="Master Vault Key"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-neutral-700 focus:outline-none focus:border-purple-500/50 transition-all text-center tracking-[0.3em] font-mono shadow-inner"
              required
              autoFocus
            />
            <button
              disabled={loading}
              className="w-full py-4 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Vault"}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
            <div className="w-1 h-1 rounded-full bg-neutral-700" />
            <span className="text-neutral-400">Vault</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter">Environment Variables</h1>
          <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-emerald-500/90 text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setIsUnlocked(false); setMasterKey(""); }}
            className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Vault
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Search & Filter */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Filter by key name..."
            className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-neutral-700 focus:outline-none focus:border-purple-500/30 transition-all shadow-sm"
          />
        </div>

        {/* Vercel-style List */}
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-neutral-900/20 divide-y divide-white/5">
          <div className="p-4 bg-neutral-900/40 flex items-center gap-3 border-b border-white/5">
            <ChevronLeft className="w-4 h-4 text-neutral-500 -rotate-90" />
            <span className="text-sm font-medium text-neutral-300">Environment Variables</span>
          </div>

          {/* Add New Secret Block */}
          <div className="p-8 space-y-6 bg-neutral-900/40 border-b-2 border-purple-500/20">
            <form onSubmit={handleAddSecret} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Key</label>
                  <div className="flex gap-3">
                    <input
                      name="key"
                      type="text"
                      placeholder="e.g. DATABASE_URL"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      required
                    />
                    <button type="button" className="p-2.5 bg-neutral-800/50 border border-white/5 rounded-lg text-neutral-600 cursor-not-allowed">
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Value</label>
                  <div className="relative group">
                    <input
                      name="value"
                      type="password"
                      placeholder="Enter value"
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 pr-24 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      required
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="w-10 h-6 bg-neutral-800 rounded-full p-1 flex items-center justify-end">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Environments</label>
                  <div className="relative">
                    <div className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 flex items-center justify-between text-sm text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-neutral-500" />
                        Production and Preview
                      </div>
                      <ChevronLeft className="w-4 h-4 text-neutral-500 -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  disabled={addLoading}
                  type="submit"
                  className="px-6 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-50"
                >
                  {addLoading ? "Saving..." : "Add Variable"}
                </button>
              </div>
            </form>
          </div>

          {/* List of Secrets */}
          {secrets.length === 0 ? (
            <div className="p-20 text-center text-neutral-600">
              <Key className="w-8 h-8 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No environment variables found.</p>
            </div>
          ) : (
            secrets.map((secret) => (
              <div key={secret.id} className="p-8 space-y-6 hover:bg-white/[0.01] transition-colors">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Key</label>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-black/20 border border-white/5 rounded-lg py-2.5 px-4 text-white font-mono text-sm">
                      {secret.key}
                    </div>
                    <button className="p-2.5 bg-neutral-800/50 border border-white/5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/5 transition-all">
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Value</label>
                  <div className="relative group">
                    <div className="w-full bg-black/20 border border-white/5 rounded-lg py-2.5 px-4 pr-24 text-neutral-500 font-mono text-sm flex items-center">
                      {showValues[secret.id] ? secret.value : "••••••••••••••••••••••••••••••••"}
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button 
                        onClick={() => setShowValues(prev => ({ ...prev, [secret.id]: !prev[secret.id] }))}
                        className="p-1.5 text-neutral-600 hover:text-white transition-colors"
                      >
                        {showValues[secret.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => copyToClipboard(secret.value, secret.id)}
                        className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
                          copiedId === secret.id ? 'bg-emerald-500/20' : 'bg-neutral-800'
                        } ${showValues[secret.id] ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          copiedId === secret.id ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white shadow-lg'
                        }`}>
                          {copiedId === secret.id ? <Check className="w-2.5 h-2.5 text-white" /> : <Lock className="w-2.5 h-2.5 text-black" />}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-neutral-500">Environments</label>
                  <div className="relative">
                    <div className="w-full bg-black/20 border border-white/5 rounded-lg py-2.5 px-4 flex items-center justify-between text-sm text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        Production and Preview
                      </div>
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Security Note */}
        <div className="p-8 bg-neutral-900/10 border border-white/5 rounded-2xl flex gap-4">
          <ShieldAlert className="w-6 h-6 text-neutral-700 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Privacy & Security</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Environment variable values are encrypted with AES-256-GCM. Decryption only happens in your browser after providing your master key.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
