"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Activity } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "PATIENT" })
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL(file.type, 0.7)
          setAvatarBase64(dataUrl)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, avatarBase64 })
      })

      let data;
      try {
        data = await res.json()
      } catch (parseErr) {
        throw new Error("Server error or payload too large. Please try a smaller image.")
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Registration failed")
      } else {
        router.push("/login")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to server")
      setLoading(false)
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
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-3 rounded-2xl shadow-lg mb-4">
               <Activity className="text-white h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join Achyuta</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 hover:text-violet-500 font-bold hover:underline">
                Log in here
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-bold border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" required className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <input type="email" required className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input type="password" required className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Profile Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">I am a...</label>
               <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm bg-white/50 backdrop-blur-sm transition-all">
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
               </select>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-xl hover:bg-violet-600 hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 mt-6">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
