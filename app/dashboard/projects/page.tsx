import { auth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Link from "next/link"
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  LayoutGrid, 
  List, 
  Clock,
  Shield,
  ArrowRight
} from "lucide-react"

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const client = await clientPromise
  const db = client.db()
  const projects = await db.collection("projects").find({ 
    userId: new ObjectId(session.user.id) 
  }).sort({ createdAt: -1 }).toArray()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Projects
            <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-white/10 text-neutral-300">
              {projects.length}
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and organize your secure vaults.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/projects/new" 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-neutral-900/50 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-neutral-900/50 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800 text-sm font-medium rounded-lg transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 p-1 bg-neutral-900/50 border border-white/10 rounded-lg">
          <button className="p-1.5 bg-neutral-800 text-white rounded-md shadow-sm">
            <List className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800/50 rounded-md transition-all">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects List View */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FolderKanban className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No projects found</h3>
            <p className="text-sm text-neutral-500 mb-8 max-w-sm">
              Get started by creating a new project vault to securely store your environment variables.
            </p>
            <Link 
              href="/dashboard/projects/new" 
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-all border border-white/10 hover:border-white/20"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 bg-neutral-900/40 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <div className="col-span-12 sm:col-span-5">Name</div>
              <div className="hidden sm:block sm:col-span-3">Status</div>
              <div className="hidden sm:block sm:col-span-3">Last Modified</div>
              <div className="col-span-1 text-right"></div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-white/5">
              {projects.map((project) => (
                <Link 
                  key={project._id.toString()} 
                  href={`/dashboard/projects/${project._id}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                >
                  {/* Name & Icon */}
                  <div className="col-span-10 sm:col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-purple-500/50 transition-colors shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {project.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {project.description || "Secure environment vault"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-900/50 px-2 py-1 rounded-md border border-white/5">
                      <Shield className="w-3 h-3" />
                      AES-256
                    </div>
                  </div>

                  {/* Last Modified */}
                  <div className="hidden sm:flex sm:col-span-3 items-center gap-2 text-sm text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {new Date(project.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="p-2 text-neutral-500 hover:text-white rounded-md hover:bg-neutral-800 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
