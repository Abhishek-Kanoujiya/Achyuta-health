# Achyuta Health - Appointment & Follow-up Manager

A comprehensive healthcare appointment platform built with Next.js, Prisma, PostgreSQL, and Google Gemini AI.

## Features
- **Role-based Access:** Separate portals for Patients, Doctors, and Admins.
- **Smart Booking:** Strict double-booking prevention using database-level constraints.
- **AI Integration (Gemini):**
  - **Pre-visit:** Analyzes patient symptoms to generate urgency levels and suggested questions.
  - **Post-visit:** Converts clinical notes into patient-friendly summaries.
- **Notifications:** Ready for Email and Google Calendar integration.

## Setup Guide

### 1. Prerequisites
- Node.js 18+
- A PostgreSQL Database (e.g., Neon or Supabase)
- A Google Gemini API Key

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Database Setup
Push the Prisma schema to your database and generate the client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Running the App
Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## API Documentation
- `POST /api/register` - Register a new user (Patient/Doctor/Admin).
- `GET /api/patient/doctors` - Fetch all available doctors and their profiles.
- `POST /api/appointments` - Book an appointment and generate AI pre-visit summary.
- `POST /api/admin/doctors` - Create or update a doctor's profile.

## Deliverables Checklist
- [x] Complete source code (Next.js App Router)
- [x] README with setup guide, .env.example, API docs
- [x] DB Schema (located in `/prisma/schema.prisma`)
- [x] System design write-up (located in `System_Design.md`)
