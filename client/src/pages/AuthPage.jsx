import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TogglePills from '../components/ui/TogglePills.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
]

const modeOptions = [
  { label: 'Login', value: 'login' },
  { label: 'Register', value: 'register' },
]

function dashboardPath(role) {
  return `/dashboard/${role}`
}

export default function AuthPage() {
  const { login, register, user } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('customer')
  const [mode, setMode] = useState('login')
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (user) navigate(dashboardPath(user.role), { replace: true })
  }, [user, navigate])

  const initialValues = useMemo(() => {
    return { name: '', phone: '', email: '', password: '', confirmPassword: '' }
  }, [])

  const validationSchema = useMemo(() => {
    if (mode === 'login') {
      return Yup.object({
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
      })
    }

    return Yup.object({
      name: Yup.string().min(2, 'Enter your full name').required('Name is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .required('Phone is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string()
        .min(8, 'Min 8 characters')
        .matches(/[A-Z]/, 'Add 1 uppercase letter')
        .matches(/[a-z]/, 'Add 1 lowercase letter')
        .matches(/[0-9]/, 'Add 1 number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    })
  }, [mode])

  async function onSubmit(values, helpers) {
    setServerError('')
    try {
      if (mode === 'login') {
        const u = await login({ role, ...values })
        navigate(dashboardPath(u.role), { replace: true })
      } else {
        const u = await register({ role, ...values })
        navigate(dashboardPath(u.role), { replace: true })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setServerError(msg)
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <div className="nw-bg min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2">
        <div className="text-left">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Nowwagon" className="h-14 w-14" loading="eager" />
            <div>
              <div className="text-xs font-semibold tracking-widest text-slate-500">NOWWAGON</div>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Welcome
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-slate-700">
            Sign in or create an account. Choose your role to continue.
          </p>

          <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-slate-900">Role-based dashboards</div>
              <div className="mt-1 text-sm text-slate-700">
                Separate experiences for admin, driver, and customer.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-slate-900">Secure auth</div>
              <div className="mt-1 text-sm text-slate-700">
                JWT login, validations, and reset-password flow.
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-left">
                <div className="text-xs font-semibold tracking-widest text-slate-500">
                  {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  {mode === 'login' ? 'Login' : 'Register'}
                </div>
              </div>

              <TogglePills value={mode} onChange={setMode} options={modeOptions} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">Account type</div>
              <TogglePills value={role} onChange={setRole} options={roleOptions} />
            </div>

            {serverError ? (
              <div className="mt-4">
                <Alert tone="error">{serverError}</Alert>
              </div>
            ) : null}

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="mt-5 space-y-3">
                  {mode === 'register' ? (
                    <>
                      <TextField name="name" label="Full name" placeholder="e.g. Rahul Kumar" />
                      <TextField name="phone" label="Phone" placeholder="10-digit number" />
                    </>
                  ) : null}

                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />

                  {mode === 'register' ? (
                    <TextField
                      name="confirmPassword"
                      label="Re-enter password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  ) : (
                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-orange-600 hover:text-orange-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting
                      ? mode === 'login'
                        ? 'Logging in…'
                        : 'Creating…'
                      : mode === 'login'
                        ? 'Login'
                        : 'Create account'}
                  </Button>

                  <div className="pt-2 text-center text-xs text-slate-500">
                    {mode === 'login' ? (
                      <>
                        Don’t have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('register')}
                          className="font-semibold text-orange-600 hover:text-orange-500"
                        >
                          Register
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="font-semibold text-orange-600 hover:text-orange-500"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

