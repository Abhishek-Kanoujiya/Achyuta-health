import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { sendEmail } from "@/lib/email"
import { createCalendarEvent } from "@/lib/calendar"
import { saveBase64Image } from "@/lib/upload"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "PATIENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { doctorId, date, startTime, endTime, symptoms, symptomImageBase64 } = await req.json()

  // 1. Double Booking Check
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: { not: "CANCELLED" }
    }
  })

  if (existing) {
    return NextResponse.json({ error: "This slot is already booked" }, { status: 409 })
  }

  // 2. AI Pre-visit Summary
  let urgencyLevel = "MEDIUM"
  let chiefComplaint = ""
  let suggestedQuestions = ""

  if (symptoms) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const prompt = `Analyse these symptoms and return: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor. Symptoms: ${symptoms}. Respond strictly in JSON format like {"urgencyLevel": "HIGH", "chiefComplaint": "string", "suggestedQuestions": "string"}`
      const result = await model.generateContent(prompt)
      const response = await result.response.text()
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0])
         urgencyLevel = parsed.urgencyLevel?.toUpperCase() || "MEDIUM"
         chiefComplaint = parsed.chiefComplaint || ""
         suggestedQuestions = parsed.suggestedQuestions || ""
      }
    } catch (e) {
      console.error("AI Error:", e)
    }
  }

  // 3. Save Image & Create Appointment
  let symptomImageUrl = null
  if (symptomImageBase64) {
    symptomImageUrl = await saveBase64Image(symptomImageBase64)
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: session.user.id,
      doctorId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      symptoms,
      symptomImageUrl,
      urgencyLevel: ["LOW", "MEDIUM", "HIGH"].includes(urgencyLevel) ? (urgencyLevel as any) : "MEDIUM",
      chiefComplaint,
      suggestedQuestions
    }
  })

  // 4. Send Confirmation Email & Google Calendar Invite
  // Run asynchronously without blocking the response
  Promise.all([
    sendEmail({
      to: session.user.email,
      subject: "Appointment Confirmed - Achyuta Health",
      text: `Your appointment is confirmed for ${new Date(date).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString()}.`
    }),
    createCalendarEvent({
      summary: "Doctor Appointment - Achyuta Health",
      description: `Symptoms: ${symptoms}\nUrgency: ${urgencyLevel}`,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendeeEmail: session.user.email
    })
  ]).catch(err => console.error("Failed to send notifications:", err))

  return NextResponse.json(appointment)
}
