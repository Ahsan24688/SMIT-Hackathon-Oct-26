import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

const Login = ({ setIsauthorize }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setServerError('')
        setIsSubmitting(true)

        try {
            const response = await axios.post('http://localhost:3000/Login', {
                email: data.email,
                password: data.password,
            })

            if (!response.data.token) {
                setServerError('Sign in could not be completed. Please try again.')
                return
            }

            localStorage.setItem('token', response.data.token)
            setIsauthorize(true)
            navigate('/dashboard')
        } catch (error) {
            setServerError(error.response?.data?.message || 'We could not sign you in. Check your details and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 sm:px-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
                        A
                    </div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-indigo-300">ACCOUNTS</p>
                </div>

                <section className="rounded-3xl bg-white p-7 shadow-2xl shadow-black/20 sm:p-9">
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your account.</p>
                    </div>

                    {location.state?.notice && (
                        <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {location.state.notice}
                        </div>
                    )}
                    {serverError && (
                        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                className={inputClassName}
                                {...register('email', {
                                    required: 'Enter your email address.',
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
                                })}
                            />
                            {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={Boolean(errors.password)}
                                className={inputClassName}
                                {...register('password', {
                                    required: 'Enter your password.',
                                    minLength: { value: 8, message: 'Use at least 8 characters.' },
                                    maxLength: { value: 15, message: 'Use no more than 15 characters.' },
                                })}
                            />
                            {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500">
                        New here?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
                    </p>
                </section>
                <p className="mt-6 text-center text-xs text-slate-500">Secure access to your personal dashboard.</p>
            </div>
        </main>
    )
}

export default Login
