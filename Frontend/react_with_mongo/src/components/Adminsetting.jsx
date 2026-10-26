import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

const AdminSettings = () => {
    const navigate = useNavigate()
    const [companyName, setCompanyName] = useState('')
    const [companyAddress, setCompanyAddress] = useState('')
    const [deptName, setDeptName] = useState('')
    const [designations, setDesignations] = useState('')
    
    const [settingsMessage, setSettingsMessage] = useState('')
    const [deptMessage, setDeptMessage] = useState('')
    const [loadingSettings, setLoadingSettings] = useState(false)
    const [loadingDept, setLoadingDept] = useState(false)

    // 1. Save Company Settings
    const handleSaveSettings = async (e) => {
        e.preventDefault()
        setSettingsMessage('')
        setLoadingSettings(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post('http://localhost:3000/settings', {
                companyName,
                companyAddress
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSettingsMessage(res.data.message || 'Settings saved successfully!')
        } catch (error) {
            setSettingsMessage(error.response?.data?.message || 'Error saving settings.')
        } finally {
            setLoadingSettings(false)
        }
    }

    // 2. Create Department
    const handleCreateDept = async (e) => {
        e.preventDefault()
        setDeptMessage('')
        setLoadingDept(true)
        try {
            const token = localStorage.getItem('token')
            // Designations ko comma-separated string se array mein convert kar rahe hain
            const desigArray = designations.split(',').map(d => d.trim()).filter(Boolean)
            
            const res = await axios.post('http://localhost:3000/departments', {
                name: deptName,
                designations: desigArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setDeptMessage(res.data.message || 'Department created successfully!')
            setDeptName('')
            setDesignations('')
        } catch (error) {
            setDeptMessage(error.response?.data?.message || 'Error creating department.')
        } finally {
            setLoadingDept(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Company & Admin Settings</h1>
                        <p className="text-sm text-slate-500">Manage company details and organizational departments (Module 2).</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Company Settings Section */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-lg font-semibold text-slate-900">Company Settings</h2>
                        <p className="mt-1 text-sm text-slate-500">Configure core company information.</p>

                        {settingsMessage && (
                            <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                                {settingsMessage}
                            </div>
                        )}

                        <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
                            <div>
                               
                             <label className="mb-2 block text-sm font-medium text-slate-700">Company Name</label>
                                <input
                                type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Urban Tech Corp"
                                    required
                                    className={inputClassName}
                                    />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Company Address</label>
                                <input
                                    type="text"
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    placeholder="e.g. Karachi, Pakistan"
                                    required
                                    className={inputClassName}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingSettings}
                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {loadingSettings ? 'Saving...' : 'Save Company Settings'}
                            </button>
                        </form>
                    </section>

                    {/* Department Creation Section */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-lg font-semibold text-slate-900">Create Department</h2>
                        <p className="mt-1 text-sm text-slate-500">Add departments and designations.</p>

                        {deptMessage && (
                            <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                                {deptMessage}
                            </div>
                        )}

                        <form onSubmit={handleCreateDept} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Department Name</label>
                                <input
                                    type="text"
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    placeholder="e.g. Engineering"
                                    required
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Designations (comma separated)</label>
                                <input
                                    type="text"
                                    value={designations}
                                    onChange={(e) => setDesignations(e.target.value)}
                                    placeholder="e.g. Manager, Senior Dev, Intern"
                                    required
                                    className={inputClassName}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingDept}
                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {loadingDept ? 'Creating...' : 'Create Department'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default AdminSettings