"use client"
import { useState, useEffect } from "react"

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppt, setSelectedAppt] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = () => {
    fetch("/api/doctor/appointments")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setAppointments(data)
        setLoading(false)
      })
  }

  const handleSubmitNotes = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppt) return
    setSubmitting(true)

    await fetch("/api/doctor/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: selectedAppt.id,
        clinicalNotes: notes
      })
    })

    setSubmitting(false)
    setSelectedAppt(null)
    setNotes("")
    fetchAppointments()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-emerald-900 border-b-2 border-emerald-200 pb-2">Doctor Portal</h2>
      
      {selectedAppt && (
        <div className="bg-emerald-50 shadow-lg rounded-xl p-6 mb-6 border-2 border-emerald-300">
          <h3 className="text-xl font-bold mb-2 text-emerald-900">Post-Visit Notes for {selectedAppt.patient.name}</h3>
          <p className="text-sm text-gray-700 mb-4"><strong>Patient Symptoms:</strong> {selectedAppt.symptoms}</p>
          <form onSubmit={handleSubmitNotes}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
            <textarea required rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 border mb-4 text-slate-900" placeholder="Type your clinical medical notes here. The AI will translate them for the patient..." />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedAppt(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button disabled={submitting} type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50">
                {submitting ? "Processing AI..." : "Submit & Generate Summary"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-emerald-600">
        <h3 className="text-xl font-semibold mb-2 text-emerald-800">Your Upcoming Appointments</h3>
        <p className="text-gray-600 mb-6">View patient details, pre-visit AI summaries, and submit post-visit clinical notes.</p>
        
        {loading ? <p>Loading appointments...</p> : (
          <div className="grid gap-4">
            {appointments.map((appt: any) => (
              <div key={appt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 shrink-0">
                      <img src={appt.patient.avatarUrl || `https://i.pravatar.cc/150?u=${appt.patient.email}`} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-emerald-900">{appt.patient.name}</h4>
                      <p className="text-sm text-gray-500">{new Date(appt.date).toLocaleDateString()} at {new Date(appt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${appt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {appt.status}
                  </span>
                </div>
                
                <div className="mb-4 text-sm bg-white p-3 rounded border border-gray-100">
                  <p className="text-red-600 font-bold">Urgency: {appt.urgencyLevel}</p>
                  <p className="mt-1"><strong>Symptoms:</strong> {appt.symptoms}</p>
                  {appt.symptomImageUrl && (
                    <div className="mt-3">
                      <p className="font-bold text-gray-700 mb-1">Attached Symptom Photo:</p>
                      <img src={appt.symptomImageUrl} alt="Symptom" className="w-full max-w-sm rounded-lg border border-gray-200 shadow-sm" />
                    </div>
                  )}
                  {appt.chiefComplaint && <p className="mt-3 text-emerald-700 bg-emerald-50 p-2 rounded"><strong>AI Chief Complaint:</strong> {appt.chiefComplaint}</p>}
                </div>

                {appt.status !== 'COMPLETED' ? (
                  <button onClick={() => { setSelectedAppt(appt); setNotes(""); }} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700">
                    Write Post-Visit Notes
                  </button>
                ) : (
                  <div className="bg-emerald-50 p-3 rounded text-sm border border-emerald-100">
                    <p><strong>Your Notes:</strong> {appt.clinicalNotes}</p>
                    <p className="mt-2 text-emerald-800"><strong>AI Patient Summary:</strong> {appt.postVisitSummary}</p>
                  </div>
                )}
              </div>
            ))}
            {appointments.length === 0 && <p className="text-gray-500 italic">You have no upcoming appointments.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
