import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

const Dashboard = ({ setIsauthorize }) => {
    const [data, setData] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)
    const navigate = useNavigate()


    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true)
            setLoadError('')
            try {
                const token = localStorage.getItem('token')
                if (!token) return navigate('/login')

                const res = await axios.get('http://localhost:3000/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setData(res.data.data)
            } catch (error) {
                console.error("Dashboard data fetch error:", error)
                setLoadError(error.response?.data?.message || 'We could not load your account details. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [navigate, refreshKey])

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

    const fullName = [data?.fname, data?.lname].filter(Boolean).join(' ')
    const initials = [data?.fname, data?.lname]
        .filter(Boolean)
        .map((name) => name[0].toUpperCase())
        .join('')

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/dashboard" className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20">
                            A
                        </span>
                        <span>
                            <span className="block text-sm font-bold tracking-tight text-slate-900">Accounts</span>
                            <span className="block text-xs text-slate-500">Personal workspace</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="hidden items-center gap-3 sm:flex">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                                {initials || 'U'}
                            </div>
                            <div className="max-w-40">
                                <p className="truncate text-sm font-semibold text-slate-800">{fullName || 'Your account'}</p>
                                <p className="text-xs text-slate-500">{data?.role || 'Member'}</p>
                            </div>
                        </div>
                        <span className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden="true" />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:px-4"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600">YOUR WORKSPACE</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            {fullName ? `Welcome, ${data?.fname}` : 'Welcome to your dashboard'}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Manage your profile and account preferences from one place.
                        </p>
                    </div>
                    {data?.role && (
                        <span className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-700">
                            {data.role} account
                        </span>
                    )}
                </div>

                {loadError && (
                    <div role="alert" className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-rose-700">{loadError}</p>
                        <button
                            type="button"
                            onClick={() => setRefreshKey((currentKey) => currentKey + 1)}
                            className="w-fit rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
                        >
                            Try again
                        </button>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="profile-heading">
                        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-700 ring-1 ring-indigo-100">
                                {isLoading ? '…' : initials || 'U'}
                            </div>
                            <div>
                                <h2 id="profile-heading" className="text-xl font-bold tracking-tight text-slate-900">Profile overview</h2>
                                <p className="mt-1 text-sm text-slate-500">Your personal account information.</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-5 pt-6" role="status" aria-label="Loading profile">
                                <span className="block h-4 w-28 animate-pulse rounded bg-slate-100" />
                                <span className="block h-4 w-48 animate-pulse rounded bg-slate-100" />
                                <span className="block h-4 w-36 animate-pulse rounded bg-slate-100" />
                            </div>
                        ) : (
                            <dl className="grid gap-x-8 gap-y-6 pt-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full name</dt>
                                    <dd className="mt-2 text-sm font-semibold text-slate-800">{fullName || 'Not provided'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account type</dt>
                                    <dd className="mt-2 text-sm font-semibold text-slate-800">{data?.role || 'Member'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">First name</dt>
                                    <dd className="mt-2 text-sm font-semibold text-slate-800">{data?.fname || 'Not provided'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last name</dt>
                                    <dd className="mt-2 text-sm font-semibold text-slate-800">{data?.lname || 'Not provided'}</dd>
                                </div>
                            </dl>
                        )}

                        {data?.role === 'Admin' && (
                            <div className="mt-7 border-t border-slate-100 pt-6">
                                <Link
                                    to="/admin-settings"
                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                >
                                    Company &amp; admin settings
                                </Link>
                            </div>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="status-heading">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Account status</p>
                                    <h2 id="status-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                        {isLoading ? 'Checking…' : loadError ? 'Unavailable' : 'Active'}
                                    </h2>
                                </div>
                                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${loadError ? 'bg-rose-50 text-rose-600' : isLoading ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`} aria-hidden="true">
                                    {isLoading ? '…' : loadError ? '!' : '✓'}
                                </span>
                            </div>
                            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                                <span className={`h-2 w-2 rounded-full ${loadError ? 'bg-rose-500' : isLoading ? 'bg-slate-400' : 'bg-emerald-500'}`} aria-hidden="true" />
                                <p className="text-xs text-slate-500">
                                    {loadError ? 'Account details could not be verified' : isLoading ? 'Loading your account details' : 'Your account is in good standing'}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6" aria-labelledby="security-heading">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5.5 6v5.2c0 4.3 2.7 7.7 6.5 9.8 3.8-2.1 6.5-5.5 6.5-9.8V6L12 3Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12 1.7 1.7 3.5-3.7" />
                                </svg>
                            </div>
                            <h2 id="security-heading" className="mt-4 font-semibold text-slate-900">Your account, at a glance</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Sign out whenever you use a shared device to help keep your account secure.
                            </p>
                        </section>
                    </aside>
                </div>

                <section className="mt-6 rounded-2xl border border-rose-200/80 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="delete-heading">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
                                    </svg>
                                </span>
                                <h2 id="delete-heading" className="font-semibold text-slate-900">Delete account</h2>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Permanently remove your account and associated data. This action cannot be undone.
                            </p>
                            {deleteError && <p role="alert" className="mt-3 text-sm font-medium text-rose-700">{deleteError}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={handleAccountDelete}
                            disabled={isDeleting}
                            className="w-fit shrink-0 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
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