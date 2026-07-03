"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })

    if (res?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4 relative"
      style={{ backgroundImage: "url('/images/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay to make the glass pop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Glassmorphism Card */}
        <div className="bg-white/60 backdrop-blur-xl p-10 shadow-2xl rounded-3xl border border-white/50">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl shadow-lg mb-4">
               <Stethoscope className="text-white h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              New to Achyuta Health?{" "}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-bold border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <input type="email" required className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input type="password" required className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-xl hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 mt-4">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
