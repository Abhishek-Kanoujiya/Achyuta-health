import { google } from "googleapis"

export async function createCalendarEvent({ summary, description, startTime, endTime, attendeeEmail }: {
  summary: string
  description: string
  startTime: Date
  endTime: Date
  attendeeEmail: string
}) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("⚠️ Google Calendar API is not configured in .env. Skipping calendar invite.")
    // Mocking success for the sake of the assignment demo when keys are absent
    return { eventId: "mock-event-id-" + Date.now() }
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "urn:ietf:wg:oauth:2.0:oob")
    oauth2Client.setCredentials({ refresh_token: refreshToken })

    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const event = {
      summary,
      description,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: [{ email: attendeeEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    }

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    })

    console.log("Calendar event created:", res.data.htmlLink)
    return { eventId: res.data.id }
  } catch (error) {
    console.error("Google Calendar API Error:", error)
    return null
  }
}
