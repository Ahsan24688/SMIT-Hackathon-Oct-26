import { useState } from 'react'
import axios from 'axios'

const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

const AdminSettings = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Company Settings State
    const [settings, setSettings] = useState({
        companyName: '',
        officeStartTime: '09:00',
        graceTimeMinutes: 15,
        latitude: '',
        longitude: '',
        radiusMeters: 150
    })

    // Department State
    const [deptName, setDeptName] = useState('')
    const [designations, setDesignations] = useState('')

    // Handle Company Settings Submit
    const handleSettingsSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')
        setLoading(true)

        try {
            const token = localStorage.getItem('token') // Login ke waqt jo token save kiya tha
            const res = await axios.post('http://localhost:3000/settings', {
                companyName: settings.companyName,
                officeStartTime: settings.officeStartTime,
                graceTimeMinutes: Number(settings.graceTimeMinutes),
                officeLocation: {
                    latitude: Number(settings.latitude),
                    longitude: Number(settings.longitude),
                    radiusMeters: Number(settings.radiusMeters)
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setMessage(res.data.message)
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving settings')
        } finally {
            setLoading(false)
        }
    }

    // Handle Department Submit
    const handleDeptSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            const token = localStorage.getItem('token')
            // Designations ko comma-separated string se array mein convert kar rahe hain (e.g. "Dev, Lead" -> ["Dev", "Lead"])
            const desigArray = designations.split(',').map(d => d.trim()).filter(Boolean)

            const res = await axios.post('http://localhost:3000/departments', {
                name: deptName,
                designations: desigArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setMessage(res.data.message)
            setDeptName('')
            setDesignations('')
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating department')
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Admin Organization Setup</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage company settings and departments (Module 2)</p>
                </div>

                {message && (
                    <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-200">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-200">
                        {error}
                    </div>
                )}

                {/* 1. Company Settings Form */}
                <section className="rounded-3xl bg-white p-7 shadow-xl sm:p-9">
                    <h2 className="text-lg font-bold text-slate-900 mb-5">Company & Office Settings</h2>
                    <form onSubmit={handleSettingsSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. HCM Tech"
                                className={inputClassName}
                                value={settings.companyName}
                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Office Start Time</label>
                                <input
                                    type="text"
                                    placeholder="09:00"
                                    className={inputClassName}
                                    value={settings.officeStartTime}
                                    onChange={(e) => setSettings({ ...settings, officeStartTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Grace Time (Minutes)</label>
                                <input
                                    type="number"
                                    className={inputClassName}
                                    value={settings.graceTimeMinutes}
                                    onChange={(e) => setSettings({ ...settings, graceTimeMinutes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="24.8607"
                                    className={inputClassName}
                                    value={settings.latitude}
                                    onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="67.0011"
                                    className={inputClassName}
                                    value={settings.longitude}
                                    onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Radius (Meters)</label>
                                <input
                                    type="number"
                                    className={inputClassName}
                                    value={settings.radiusMeters}
                                    onChange={(e) => setSettings({ ...settings, radiusMeters: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Company Settings'}
                        </button>
                    </form>
                </section>

                {/* 2. Department Creation Form */}
                <section className="rounded-3xl bg-white p-7 shadow-xl sm:p-9">
                    <h2 className="text-lg font-bold text-slate-900 mb-5">Add Department & Designations</h2>
                    <form onSubmit={handleDeptSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Engineering"
                                className={inputClassName}
                                value={deptName}
                                onChange={(e) => setDeptName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Designations (comma separated)</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Software Engineer, Team Lead, QA"
                                className={inputClassName}
                                value={designations}
                                onChange={(e) => setDesignations(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                        >
                            Create Department
                        </button>
                    </form>
                </section>
            </div>
        </main>
    )
}

export default AdminSettings