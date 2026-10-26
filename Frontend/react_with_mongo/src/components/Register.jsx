import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState('')
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            role: 'Employee'
        }
    })

    const onSubmit = async (data) => {
        setServerError('')
        setIsSubmitting(true)

        try {
            await axios.post('http://localhost:3000/register', {
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                password: data.password,
                role: data.role,
            })
            navigate('/login', { state: { notice: 'Your account is ready. Sign in to continue.' } })
        } catch (error) {
            setServerError(error.response?.data?.message || 'We could not create your account. Please try again.')
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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Join us today. It only takes a minute to get started.</p>
                    </div>

                    {serverError && (
                        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="fname" className="mb-2 block text-sm font-medium text-slate-700">First name</label>
                                <input
                                    id="fname"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="First name"
                                    aria-invalid={Boolean(errors.fname)}
                                    className={inputClassName}
                                    {...register('fname', {
                                        required: 'Enter your first name.',
                                        minLength: { value: 3, message: 'Use at least 3 characters.' },
                                        maxLength: { value: 15, message: 'Use no more than 15 characters.' },
                                    })}
                                />
                                {errors.fname && <p className="mt-1.5 text-xs text-rose-600">{errors.fname.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="lname" className="mb-2 block text-sm font-medium text-slate-700">Last name</label>
                                <input
                                    id="lname"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Last Name"
                                    aria-invalid={Boolean(errors.lname)}
                                    className={inputClassName}
                                    {...register('lname', {
                                        required: 'Enter your last name.',
                                        minLength: { value: 3, message: 'Use at least 3 characters.' },
                                        maxLength: { value: 15, message: 'Use no more than 15 characters.' },
                                    })}
                                />
                                {errors.lname && <p className="mt-1.5 text-xs text-rose-600">{errors.lname.message}</p>}
                            </div>
                        </div>

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
                                autoComplete="new-password"
                                placeholder="Create a password"
                                aria-invalid={Boolean(errors.password)}
                                className={inputClassName}
                                {...register('password', {
                                    required: 'Create a password.',
                                    minLength: { value: 8, message: 'Use at least 8 characters.' },
                                    maxLength: { value: 15, message: 'Use no more than 15 characters.' },
                                })}
                            />
                            {errors.password
                                ? <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>
                                : <p className="mt-1.5 text-xs text-slate-400">Use 8–15 characters.</p>}
                        </div>
                        <div>
                            <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">Account Role</label>
                            <select
                                id="role"
                                className={inputClassName}
                                {...register('role', { required: 'Select a role.' })}
                            >
                                <option value="Employee">Employee</option>
                                <option value="HR">HR</option>
                                <option value="Admin">Admin</option>
                            </select>
                            {errors.role && <p className="mt-1.5 text-xs text-rose-600">{errors.role.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
                    </p>
                </section>
                <p className="mt-6 text-center text-xs text-slate-500">Your information is kept private and secure.</p>
            </div>
        </main>
    )
}

export default Register
