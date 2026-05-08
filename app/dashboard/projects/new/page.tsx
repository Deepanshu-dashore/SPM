"use client"

import { createProject } from "@/actions/vault"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FolderPlus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      const id = await createProject(name, description)
      router.push(`/dashboard/projects/${id}`)
    } catch (err) {
      alert("Failed to create project")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <Link 
        href="/dashboard/projects" 
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-10 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        All Projects
      </Link>

      <div className="bg-neutral-900/40 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden">
        {/* Subtle accent blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -z-10" />

        <div className="w-16 h-16 bg-neutral-800 border border-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
          <FolderPlus className="w-8 h-8 text-white" />
        </div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">New Project</h1>
          <p className="text-neutral-500 mt-2">Set up a secure vault for your environment variables.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Project Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Cloud Infrastructure"
              className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-neutral-700 focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Brief overview of the secrets stored here."
              rows={3}
              className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-neutral-700 focus:outline-none focus:border-purple-500/50 transition-all resize-none shadow-inner"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Vault"}
          </button>
        </form>
      </div>
    </div>
  )
}
