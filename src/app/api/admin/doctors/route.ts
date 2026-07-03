import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    include: { doctorProfile: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(doctors)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { userId, specialization, workingHours, slotDuration, leaveDays } = await req.json()

  const profile = await prisma.doctorProfile.upsert({
    where: { userId },
    update: { specialization, workingHours, slotDuration: parseInt(slotDuration), leaveDays },
    create: { userId, specialization, workingHours, slotDuration: parseInt(slotDuration), leaveDays }
  })

  return NextResponse.json(profile)
}
