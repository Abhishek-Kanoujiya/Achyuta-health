import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
import { Stethoscope } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-indigo-600 transition-colors">
                  <Stethoscope className="text-white h-5 w-5" />
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">Achyuta Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {session.user?.name} <span className="text-indigo-600 ml-1">({session.user?.role})</span>
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
