# System Design: Healthcare Appointment & Follow-up Manager

## 1. Double-Booking Prevention
To ensure robust double-booking prevention, the system relies on database-level constraints and atomic transactions rather than application-level checks, which are susceptible to race conditions under high concurrency. 
- **Unique Constraint:** The `Appointment` table in the PostgreSQL database has a composite unique constraint: `@@unique([doctorId, startTime, endTime])`. This guarantees that the database engine itself will reject any attempt to insert a conflicting appointment for the same doctor at the exact same time.
- **Transaction Flow:** When a patient attempts to book a slot, the application first performs a `findFirst` query to check for existing non-cancelled appointments in that time range. If the slot appears free, it attempts to `create` the appointment. If two users try to book simultaneously, the first transaction commits successfully, while the second transaction fails at the database level due to the unique constraint, returning an HTTP 409 Conflict error to the user gracefully.

## 2. Doctor Leave Conflict Handling
When a doctor's schedule changes and they are marked on leave for a specific date, existing appointments must be managed carefully.
- **Leave Registration:** The Admin portal allows updating a `DoctorProfile` by appending dates to the `leaveDays` array.
- **Conflict Detection:** Upon updating the leave days, an asynchronous background job is triggered. This job queries the `Appointment` table for all `SCHEDULED` appointments belonging to that doctor on the newly added leave dates.
- **Resolution & Notification:** The system automatically transitions the status of these affected appointments to `CANCELLED`. Simultaneously, it pushes a notification payload to the email queue (e.g., Resend or SendGrid) and triggers a Google Calendar API call to remove the event from the patient's calendar. The email informs the patient of the cancellation and provides a direct link to reschedule.

## 3. Slot Hold Mechanism
To prevent frustration where a slot is taken while a patient is filling out the AI symptom form, a temporary "Slot Hold" mechanism is implemented.
- **State Management:** When a patient selects a time slot, a temporary hold record is created in a high-speed data store (like Redis, or an in-memory cache if scaled down) with a TTL (Time-To-Live) of 10 minutes. 
- **Booking Exclusivity:** During this 10-minute window, the slot is marked as `HELD` for that specific user session. If another patient queries available slots, the held slot is omitted from the available pool.
- **Expiration:** If the patient completes the symptom form and confirms the booking within the TTL, the hold is deleted, and the permanent database record is created. If the TTL expires, the hold is automatically evicted, and the slot becomes available to the public again without requiring any cleanup cron jobs.

## 4. Notification Reliability & Failure Handling
Given the critical nature of healthcare notifications (booking confirmations, medication reminders, cancellations), the system must handle third-party service failures (like Email API or Google Calendar API downtime) gracefully.
- **Queue-Based Processing:** Notifications are not sent synchronously during the HTTP request lifecycle. Instead, they are pushed to a background job queue (e.g., Upstash QStash or a local BullMQ queue). 
- **Retry Mechanism:** If the Email service (e.g., SendGrid) returns a 5xx error or times out, the background job processor catches the exception and schedules a retry with exponential backoff (e.g., retry in 1m, 5m, 15m, 1h). 
- **Dead Letter Queue (DLQ):** If a notification fails after maximum retry attempts (e.g., invalid email address resulting in a hard bounce), the job is moved to a DLQ. The Admin dashboard can monitor the DLQ to manually identify patients who are not receiving critical updates.
- **Graceful Degradation:** If the Google Calendar API fails during the booking process, the appointment is still successfully created in the local database. The user is informed that the appointment is confirmed, but the calendar invite will be synced shortly. A background job continues to attempt the calendar sync independently of the user's booking experience, ensuring the core booking system never breaks due to external API failures.
