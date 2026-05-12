"use client"

import { useState, useEffect } from "react"
import { getSecrets, addSecret } from "@/actions/vault"
import { 
  Lock, Eye, EyeOff, Copy, Plus, Loader2, ShieldAlert, Key, Search, 
  ChevronLeft, Check, Activity, ShieldCheck, ChevronDown, MoreVertical, 
  Trash2, Edit3, Filter, ArrowUpDown, Terminal, Globe, User, LayoutGrid, Grid3X3,
  Calendar, Clock
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { updateSecret, deleteSecret, importSecrets } from "@/actions/vault"

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
  const [activeTab, setActiveTab] = useState("project")
  const [envFilter, setEnvFilter] = useState("All Environments")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSecret, setEditingSecret] = useState<any>(null)
  const [newSecretEnv, setNewSecretEnv] = useState("production")
  const [searchQuery, setSearchQuery] = useState("")
  const [modalTab, setModalTab] = useState("single") // "single" or "bulk"
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

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

  const handleSaveSecret = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAddLoading(true)
    const formData = new FormData(e.currentTarget)
    const key = formData.get("key") as string
    const value = formData.get("value") as string

    try {
      if (modalTab === "bulk") {
        const envContent = formData.get("envContent") as string
        await importSecrets(id as string, masterKey, envContent, newSecretEnv)
      } else if (editingSecret) {
        await updateSecret(editingSecret.id, masterKey, key, value, newSecretEnv)
      } else {
        await addSecret(id as string, masterKey, key, value, newSecretEnv)
      }
      const data = await getSecrets(id as string, masterKey)
      setSecrets(data)
      setIsModalOpen(false)
      setEditingSecret(null)
      setModalTab("single")
    } catch (err) {
      alert("Failed to save secret")
    } finally {
      setAddLoading(false)
    }
  }

  const handleDeleteSecret = async (secretId: string) => {
    if (!confirm("Are you sure you want to delete this secret?")) return
    try {
      await deleteSecret(secretId)
      const data = await getSecrets(id as string, masterKey)
      setSecrets(data)
    } catch (err) {
      alert("Failed to delete secret")
    }
  }

  const openEditModal = (secret: any) => {
    setEditingSecret(secret)
    setNewSecretEnv(secret.environment)
    setIsModalOpen(true)
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
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-white/5">
          {["Project", "Shared"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.toLowerCase() ? "text-white" : "text-neutral-500 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 lg:overflow-visible lg:pb-0 scrollbar-hide flex-nowrap">
          <div className="relative min-w-[160px] flex-1 max-w-[300px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-white transition-all whitespace-nowrap">
                {envFilter}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl shadow-2xl opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto z-50 transition-all p-1">
                {["All Environments", "production", "staging", "local"].map((env) => (
                  <button
                    key={env}
                    onClick={() => setEnvFilter(env)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all capitalize"
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-white transition-all whitespace-nowrap">
              All Editors
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-white transition-all whitespace-nowrap">
              All Variables
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-white transition-all whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Last Updated
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={() => { setEditingSecret(null); setIsModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[11px] font-bold rounded-lg hover:bg-neutral-200 transition-all whitespace-nowrap shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Variable
            </button>

            <div className="flex items-center bg-[#111111] border border-white/10 rounded-lg p-0.5 ml-1 shrink-0">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <motion.div whileTap={{ scale: 0.9 }}><LayoutGrid className="w-3.5 h-3.5" /></motion.div>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <motion.div whileTap={{ scale: 0.9 }}><Grid3X3 className="w-3.5 h-3.5" /></motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Secret List/Grid */}
        {viewMode === "list" ? (
          <div className="space-y-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {secrets
              .filter(s => (envFilter === "All Environments" || s.environment === envFilter))
              .filter(s => s.key.toLowerCase().includes(searchQuery.toLowerCase()))
              .length === 0 ? (
              <div className="p-20 text-center text-neutral-600 bg-[#09090B]">
                <Key className="w-8 h-8 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No environment variables found.</p>
              </div>
            ) : (
              secrets
                .filter(s => (envFilter === "All Environments" || s.environment === envFilter))
                .filter(s => s.key.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((secret) => (
                <div 
                  key={secret.id} 
                  className="group flex items-center justify-between p-4 bg-[#09090B] hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-neutral-900 group-hover:border-white/20 transition-all">
                      <Terminal className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight">{secret.key}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                          Needs Attention
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-500 capitalize">{secret.environment}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="relative group/value flex items-center gap-3 bg-neutral-900/50 px-3 py-1.5 rounded-lg border border-white/5 min-w-[200px]">
                      <button 
                        onClick={() => setShowValues(prev => ({ ...prev, [secret.id]: !prev[secret.id] }))}
                        className="p-1 hover:text-white text-neutral-600 transition-colors"
                      >
                        {showValues[secret.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <code className="text-xs text-neutral-400 font-mono flex-1">
                        {showValues[secret.id] ? secret.value : "••••••••••••••••"}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(secret.value, secret.id)}
                        className="p-1 hover:text-white text-neutral-600 transition-colors"
                      >
                        {copiedId === secret.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-500">
                        Added {new Date(secret.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border border-white/10 shadow-lg flex items-center justify-center">
                        <User className="w-3 h-3 text-white/50" />
                      </div>
                      <div className="relative group/menu">
                        <button className="p-1.5 text-neutral-600 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-40 bg-[#111111] border border-white/10 rounded-xl shadow-2xl opacity-0 pointer-events-none group-focus-within/menu:opacity-100 group-focus-within/menu:pointer-events-auto z-50 transition-all p-1">
                          <button 
                            onClick={() => openEditModal(secret)}
                            className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSecret(secret.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-lg flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secrets
              .filter(s => (envFilter === "All Environments" || s.environment === envFilter))
              .filter(s => s.key.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((secret) => (
              <motion.div 
                layout
                key={secret.id}
                className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col gap-6 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-all" />
                
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="relative group/menu">
                    <button className="p-1.5 text-neutral-600 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full right-0 mt-1 w-40 bg-[#111111] border border-white/10 rounded-xl shadow-2xl opacity-0 pointer-events-none group-focus-within/menu:opacity-100 group-focus-within/menu:pointer-events-auto z-[100] transition-all p-1">
                      <button 
                        onClick={() => openEditModal(secret)}
                        className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteSecret(secret.id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-lg flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white tracking-tight">{secret.key}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] font-bold uppercase tracking-widest border border-purple-500/20">
                      {secret.environment}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">
                      Encrypted
                    </span>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative group/value">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Secret Value</span>
                    <button 
                      onClick={() => setShowValues(prev => ({ ...prev, [secret.id]: !prev[secret.id] }))}
                      className="text-neutral-600 hover:text-white transition-colors"
                    >
                      {showValues[secret.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <code className="text-xs text-neutral-400 font-mono break-all block min-h-[1.5rem]">
                    {showValues[secret.id] ? secret.value : "••••••••••••••••••••••••"}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(secret.value, secret.id)}
                    className="absolute bottom-3 right-3 p-1.5 bg-[#111111] border border-white/10 rounded-lg text-neutral-600 hover:text-white opacity-0 group-hover/value:opacity-100 transition-all"
                  >
                    {copiedId === secret.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold border border-white/10">
                      <User className="w-3 h-3 text-white/50" />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium">Added by You</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-medium">
                      {new Date(secret.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {editingSecret ? "Edit Variable" : "Add Variables"}
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      {editingSecret ? "Update your secret settings." : "Add one or multiple secrets at once."}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Key className="w-6 h-6 text-neutral-400" />
                  </div>
                </div>

                {!editingSecret && (
                  <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-white/5 rounded-xl mb-8">
                    {["single", "bulk"].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setModalTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                          modalTab === tab ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        {tab === "single" ? "Single Entry" : "Import .env"}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSaveSecret} className="space-y-6">
                  {modalTab === "single" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Key Name</label>
                        <input
                          name="key"
                          defaultValue={editingSecret?.key}
                          type="text"
                          placeholder="e.g. DATABASE_URL"
                          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                          required={modalTab === "single"}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Secret Value</label>
                        <div className="relative">
                          <input
                            name="value"
                            defaultValue={editingSecret?.value}
                            type="password"
                            placeholder="••••••••••••••••"
                            className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                            required={modalTab === "single"}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Lock className="w-4 h-4 text-neutral-700" />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">.env Content</label>
                      <textarea
                        name="envContent"
                        placeholder="KEY=VALUE&#10;ANOTHER_KEY=ANOTHER_VALUE"
                        rows={8}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-mono resize-none"
                        required={modalTab === "bulk"}
                      />
                      <p className="text-[10px] text-neutral-600 ml-1">
                        Paste your .env file content. Empty lines and comments starting with # will be skipped.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Target Environment</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["production", "staging", "local"].map((env) => (
                        <button
                          key={env}
                          type="button"
                          onClick={() => setNewSecretEnv(env)}
                          className={`py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                            newSecretEnv === env
                              ? "bg-white text-black border-white"
                              : "bg-black border-white/10 text-neutral-500 hover:border-white/20"
                          }`}
                        >
                          {env}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 bg-neutral-900 text-neutral-400 font-bold rounded-xl hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={addLoading}
                      type="submit"
                      className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                    >
                      {addLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        editingSecret ? "Update Variable" : modalTab === "bulk" ? "Import Variables" : "Create Variable"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
