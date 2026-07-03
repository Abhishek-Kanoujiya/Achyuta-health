"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarClock, Activity, Star } from "lucide-react"

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/patient/doctors")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setDoctors(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Patient Portal</h2>
          <p className="text-lg text-slate-600 font-medium mt-2">Find your specialist and book a smart appointment.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl p-8 border border-white/80">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-violet-100 p-2 rounded-xl">
             <CalendarClock className="text-violet-600 h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Available Specialists</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor: any, idx: number) => (
              <div key={doctor.id} className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-violet-50 transition-colors h-14 w-14 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={doctor.avatarUrl || `https://loremflickr.com/150/150/doctor,portrait?lock=${idx + 1}`} 
                      alt={doctor.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold">
                    <Star className="h-3 w-3 fill-current" /> 5.0
                  </div>
                </div>
                <h4 className="font-black text-xl text-slate-900">{doctor.name}</h4>
                <p className="text-violet-600 font-bold mb-3">{doctor.doctorProfile?.specialization}</p>
                <div className="text-sm font-medium text-slate-500 mb-6 space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p>🕒 {doctor.doctorProfile?.workingHours}</p>
                  <p>⏱️ {doctor.doctorProfile?.slotDuration} min slots</p>
                </div>
                <a 
                  href={`/dashboard/patient/book/${doctor.id}`}
                  className="mt-auto bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-violet-600 transition-colors text-center font-bold block shadow-md group-hover:shadow-violet-500/30">
                  Book Appointment
                </a>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                No specialists are currently available. Check back later!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
