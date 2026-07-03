import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const role = session.user.role

  if (role === "ADMIN") {
    redirect("/dashboard/admin")
  } else if (role === "DOCTOR") {
    redirect("/dashboard/doctor")
  } else {
    redirect("/dashboard/patient")
  }
}
