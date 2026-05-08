import Image from "next/image";
import Link from "next/link";
import { Shield, Zap, Key, Eye, Copy, Database, Globe, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E7EB] selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="VaultX" 
              width={110} 
              height={32} 
              className="brightness-110"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#security" className="hover:text-white transition-colors">Security</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-all neon-glow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            <span>Now with Team Vaults</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Secure Your Project Secrets <br /> Without the Chaos
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Encrypted environment variable vault built for developers and teams. 
            Store API keys, database credentials, and tokens with industry-standard AES-256-GCM.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all neon-glow flex items-center justify-center gap-2"
            >
              Start Securing Secrets
              <Shield className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com" 
              className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              View on GitHub
            </Link>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-20"></div>
            <div className="relative bg-[#111827] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500 font-mono">vaultx.app/dashboard/project-alpha</div>
              </div>
              <div className="p-8">
                <div className="flex flex-col gap-4">
                  {[
                    { key: "DATABASE_URL", val: "mongodb+srv://admin:••••••••@cluster.mongodb.net/prod" },
                    { key: "STRIPE_SECRET", val: "sk_live_••••••••••••••••••••••••" },
                    { key: "OPENAI_API_KEY", val: "sk-••••••••••••••••••••••••••••••••" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4">
                        <code className="text-purple-400 font-mono text-sm">{item.key}</code>
                        <span className="text-gray-600">=</span>
                        <code className="text-gray-400 font-mono text-sm">{item.val}</code>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6 text-purple-500" />,
                title: "AES-256 Encryption",
                desc: "All secrets are encrypted at the application layer before reaching the database."
              },
              {
                icon: <Key className="w-6 h-6 text-purple-500" />,
                title: "Master Key System",
                desc: "Your data is only accessible via your master vault key. We never store it."
              },
              {
                icon: <Database className="w-6 h-6 text-purple-500" />,
                title: "Multi-Project Support",
                desc: "Organize secrets by projects, environments, or teams with ease."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-purple-500/50 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">VaultX &copy; 2026. Secure by design.</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
