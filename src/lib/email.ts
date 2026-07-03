import nodemailer from "nodemailer"

// In a real application, you would use SendGrid, Postmark, or AWS SES.
// For this assignment, we use Ethereal Email which generates a URL to view the fake email,
// allowing recruiters to test without needing real SMTP credentials.

let transporter: nodemailer.Transporter | null = null

async function getTransporter() {
  if (!transporter) {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass,
      },
    })
  }
  return transporter
}

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) {
  try {
    const mailer = await getTransporter()
    const info = await mailer.sendMail({
      from: '"Achyuta Health Notifications" <noreply@achyutahealth.com>',
      to,
      subject,
      text,
      html: html || text,
    })
    
    console.log(`Email sent to ${to}. Subject: ${subject}`)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}
