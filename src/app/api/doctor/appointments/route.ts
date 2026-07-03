import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "DOCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.id },
    include: { patient: { select: { name: true, email: true, avatarUrl: true } } },
    orderBy: { date: 'asc' }
  })
  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "DOCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { appointmentId, clinicalNotes } = await req.json()

  let postVisitSummary = ""

  if (clinicalNotes) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const prompt = `You are a helpful medical assistant. Translate the following clinical doctor notes into a simple, patient-friendly summary without medical jargon. Do not include markdown formatting, just plain text. Doctor Notes: ${clinicalNotes}`
      const result = await model.generateContent(prompt)
      postVisitSummary = await result.response.text()
    } catch (e) {
      console.error("AI Error:", e)
      postVisitSummary = "Failed to generate summary."
    }
  }

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId, doctorId: session.user.id },
    data: {
      status: "COMPLETED",
      clinicalNotes,
      postVisitSummary
    }
  })

  return NextResponse.json(appointment)
}
