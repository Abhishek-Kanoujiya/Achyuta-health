"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  
  // Form State
  const [specialization, setSpecialization] = useState("")
  const [workingHours, setWorkingHours] = useState("09:00-17:00")
  const [slotDuration, setSlotDuration] = useState("30")

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = () => {
    fetch("/api/admin/doctors")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setDoctors(data)
        setLoading(false)
      })
  }

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor)
    setSpecialization(doctor.doctorProfile?.specialization || "")
    setWorkingHours(doctor.doctorProfile?.workingHours || "09:00-17:00")
    setSlotDuration(doctor.doctorProfile?.slotDuration?.toString() || "30")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return

    await fetch("/api/admin/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: editingDoctor.id,
        specialization,
        workingHours,
        slotDuration,
        leaveDays: editingDoctor.doctorProfile?.leaveDays || []
      })
    })

    setEditingDoctor(null)
    fetchDoctors()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-900 border-b-2 border-indigo-200 pb-2">Admin Portal</h2>
      
      {editingDoctor && (
        <div className="bg-indigo-50 shadow-lg rounded-xl p-6 mb-6 border-2 border-indigo-300">
          <h3 className="text-xl font-bold mb-4 text-indigo-900">Edit Profile: {editingDoctor.name}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input required type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900" placeholder="e.g. Cardiologist" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Working Hours</label>
              <input required type="text" value={workingHours} onChange={e => setWorkingHours(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900" placeholder="09:00-17:00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slot Duration (mins)</label>
              <select value={slotDuration} onChange={e => setSlotDuration(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-slate-900">
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="60">60 mins</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setEditingDoctor(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Profile</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-indigo-600">
        <h3 className="text-xl font-semibold mb-2 text-indigo-800">Manage Doctors</h3>
        <p className="text-gray-600 mb-6">Here you can view all registered doctors and configure their profiles.</p>
        
        {loading ? <p>Loading doctors...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor: any) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900">{doctor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900">{doctor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                      {doctor.doctorProfile?.specialization || <span className="text-red-500 font-medium">Profile Incomplete</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <button onClick={() => handleEdit(doctor)} className="text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 px-3 py-1 rounded">Edit Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && <p className="mt-4 text-gray-500 italic">No doctors registered yet. Register a new account with the "Doctor" role.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
