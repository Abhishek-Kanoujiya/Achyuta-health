"use client"
import { useState, use } from "react"
import { useRouter } from "next/navigation"

export default function BookAppointment({ params }: { params: Promise<{ doctorId: string }> }) {
  const unwrappedParams = use(params)
  const doctorId = unwrappedParams.doctorId
  const router = useRouter()

  const [date, setDate] = useState("")
  const [time, setTime] = useState("09:00")
  const [symptoms, setSymptoms] = useState("")
  const [symptomImageBase64, setSymptomImageBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL(file.type, 0.7)
          setSymptomImageBase64(dataUrl)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Convert date + time to Date object
    const startDateTime = new Date(`${date}T${time}:00`)
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000) // Assumes 30 min slot

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          date,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          symptoms,
          symptomImageBase64
        })
      })

      let data;
      try {
        data = await res.json()
      } catch (parseErr) {
        throw new Error("Server error or payload too large. Please try a smaller image.")
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to book appointment")
      }
      
      setSuccess(`Appointment booked successfully! AI Urgency Level: ${data.urgencyLevel}`)
      setTimeout(() => router.push("/dashboard/patient"), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b-2 border-violet-200 pb-2">
        <h2 className="text-3xl font-bold text-violet-900">Book Appointment</h2>
        <button onClick={() => router.back()} className="text-violet-600 hover:underline">← Back</button>
      </div>

      {success ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow">
          <p className="font-bold">Success!</p>
          <p>{success}</p>
          <p className="text-sm mt-2">Redirecting to dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleBook} className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-violet-600">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
            <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700">Describe Your Symptoms</label>
            <p className="text-xs text-gray-500 mb-2">Our AI will analyze this to generate a pre-visit summary for your doctor.</p>
            <textarea required rows={4} value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900" placeholder="I have been experiencing a mild headache and fever for the last 3 days..." />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload Photo of Symptoms (Optional)</label>
            <p className="text-xs text-gray-500 mb-2">E.g., A picture of a rash or injury for the doctor to review.</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-violet-600 text-white rounded-md py-3 font-bold hover:bg-violet-700 disabled:opacity-50">
            {loading ? "Booking & Running AI Analysis..." : "Confirm Appointment"}
          </button>
        </form>
      )}
    </div>
  )
}
