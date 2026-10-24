import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

const Dashboard = ({ setIsauthorize }) => {
    const [data, setData] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return navigate('/login')

                const res = await axios.get('http://localhost:3000/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setData(res.data.data)
            } catch (error) {
                console.error("Dashboard data fetch error:", error)
            }
        }

        fetchUserData()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsauthorize(false)
        navigate('/login')
    }

    const handleAccountDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
        if (!confirmed) return

        setDeleteError('')
        setIsDeleting(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Your session has expired. Please sign in again.')
            }

            await axios.delete('http://localhost:3000/delete', {
                headers: { Authorization: `Bearer ${token}` },
            })

            localStorage.removeItem('token')
            setIsauthorize(false)
            navigate('/register')
        } catch (error) {
            setDeleteError(error.response?.data?.message || error.message || 'We could not delete your account. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
                    <p>Name: {data?.fname} {data?.lname}</p>
                    <p>Role: {data?.role}</p>

                    {data?.role === 'Admin' && (
                        <div className="mt-6">
                            <Link
                                to="/admin-settings"
                                className="inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                            >
                                Go to Company & Admin Settings (Module 2)
                            </Link>
                        </div>
                    )}
                </div>
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white">
                            {data?.fname ? data.fname[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{data?.fname} {data?.lname}</p>
                            <p className="text-xs text-slate-500">{data?.role} Account</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-600 px-7 py-9 text-white shadow-xl shadow-indigo-900/10 sm:px-10 sm:py-12">
                    <p className="text-sm font-semibold tracking-[0.16em] text-indigo-200">OVERVIEW</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome to your dashboard</h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                        You’re signed in as <span className="font-semibold underline">{data?.role}</span>. Manage your account securely from one convenient place.
                    </p>
                </div>

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                <h2 className="text-lg font-semibold text-slate-900">Account status</h2>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Your account is active and your session is secure.</p>
                        </div>
                        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Active</span>
                    </div>
                </section>

                <section className="mt-8 rounded-2xl border border-rose-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <h2 className="font-semibold text-slate-900">Delete account</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Permanently remove your account and associated data. This action cannot be undone.
                            </p>
                            {deleteError && <p role="alert" className="mt-3 text-sm text-rose-700">{deleteError}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={handleAccountDelete}
                            disabled={isDeleting}
                            className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isDeleting ? 'Deleting account…' : 'Delete account'}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Dashboard