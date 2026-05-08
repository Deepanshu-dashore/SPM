import { auth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Link from "next/link"
import { FolderKanban, Plus, ArrowUpRight, Clock } from "lucide-react"

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const client = await clientPromise
  const db = client.db()
  const projects = await db.collection("projects").find({ 
    userId: new ObjectId(session.user.id) 
  }).sort({ createdAt: -1 }).toArray()

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-neutral-500 mt-2">Manage your secure environment vaults.</p>
        </div>
        <Link 
          href="/dashboard/projects/new" 
          className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-2xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-card rounded-[3rem]">
            <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-8">Start by creating your first secure vault.</p>
            <Link 
              href="/dashboard/projects/new" 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
            >
              Create Project
            </Link>
          </div>
        ) : (
          projects.map((project) => (
            <Link 
              key={project._id.toString()} 
              href={`/dashboard/projects/${project._id}`}
              className="group relative flex flex-col h-64 p-6 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-neutral-800/50 transition-all duration-300 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500" />
              
              <div className="relative flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {project.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-purple-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                  {project.description || "Secure environment variables and secrets for this project."}
                </p>
              </div>

              <div className="relative mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
