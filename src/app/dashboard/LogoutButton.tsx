"use client"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className="bg-slate-200 text-slate-700 hover:bg-red-500 hover:text-white transition-colors px-4 py-2 rounded-full font-bold text-sm shadow-sm"
    >
      Sign out
    </button>
  )
}
