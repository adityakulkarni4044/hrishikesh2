import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TogglePills from '../components/ui/TogglePills.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import { api } from '../lib/api.js'

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
]

export default function ForgotPasswordPage() {
  const [role, setRole] = useState('customer')
  const [status, setStatus] = useState({ tone: 'info', message: '' })

  return (
    <div className="nw-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="text-left">
            <div className="text-xs font-semibold tracking-widest text-slate-500">
              PASSWORD RECOVERY
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">Forgot password</div>
            <p className="mt-2 text-sm text-slate-700">
              Enter your email and we’ll send a reset link (or show it in the server console in dev).
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500">Account type</div>
            <TogglePills value={role} onChange={setRole} options={roleOptions} />
          </div>

          {status.message ? (
            <div className="mt-4">
              <Alert tone={status.tone}>{status.message}</Alert>
            </div>
          ) : null}

          <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object({
              email: Yup.string().email('Enter a valid email').required('Email is required'),
            })}
            onSubmit={async (values, helpers) => {
              setStatus({ tone: 'info', message: '' })
              try {
                await api.post('/api/auth/forgot-password', { role, email: values.email })
                setStatus({
                  tone: 'success',
                  message:
                    'If that account exists, a reset link has been created. Check the server console/email settings.',
                })
                helpers.resetForm()
              } catch (err) {
                const msg =
                  err?.response?.data?.message || 'Could not start password reset. Try again.'
                setStatus({ tone: 'error', message: msg })
              } finally {
                helpers.setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-5 space-y-3">
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending…' : 'Send reset link'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-5 text-center text-xs text-slate-500">
            Back to{' '}
            <Link to="/auth" className="font-semibold text-orange-600 hover:text-orange-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

