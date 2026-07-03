import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function GET(req: Request) {
  // In a real Vercel environment, you would check for the CRON_SECRET:
  // if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({error: "Unauthorized"}, {status: 401})

  const appointments = await prisma.appointment.findMany({
    where: { 
      status: "COMPLETED",
      medicationSchedule: { not: null }
    },
    include: { patient: true }
  })

  let emailsSent = 0
  for (const appt of appointments) {
    if (appt.medicationSchedule && appt.patient.email) {
      await sendEmail({
        to: appt.patient.email,
        subject: "Daily Medication Reminder 💊",
        text: `Hello ${appt.patient.name},\n\nThis is your daily medication reminder.\n\nSchedule: ${appt.medicationSchedule}\n\nStay healthy!\n- Achyuta Health Team`,
      })
      emailsSent++
    }
  }

  return NextResponse.json({ success: true, message: `Processed ${appointments.length} appointments. Sent ${emailsSent} reminder emails.` })
}
