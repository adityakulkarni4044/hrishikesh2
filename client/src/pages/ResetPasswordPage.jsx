import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
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

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''
  const roleFromUrl = params.get('role') || 'customer'

  const [role, setRole] = useState(roleFromUrl)
  const [status, setStatus] = useState({ tone: 'info', message: '' })

  const initialValues = useMemo(
    () => ({
      token: tokenFromUrl,
      password: '',
      confirmPassword: '',
    }),
    [tokenFromUrl],
  )

  return (
    <div className="nw-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="text-left">
            <div className="text-xs font-semibold tracking-widest text-slate-500">
              RESET PASSWORD
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">Set a new password</div>
            <p className="mt-2 text-sm text-slate-700">
              Paste the token from your reset link (it can be prefilled from the URL).
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
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object({
              token: Yup.string().min(10, 'Invalid token').required('Token is required'),
              password: Yup.string()
                .min(8, 'Min 8 characters')
                .matches(/[A-Z]/, 'Add 1 uppercase letter')
                .matches(/[a-z]/, 'Add 1 lowercase letter')
                .matches(/[0-9]/, 'Add 1 number')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Confirm password is required'),
            })}
            onSubmit={async (values, helpers) => {
              setStatus({ tone: 'info', message: '' })
              try {
                await api.post('/api/auth/reset-password', { role, ...values })
                setStatus({
                  tone: 'success',
                  message: 'Password updated successfully. You can login now.',
                })
                helpers.resetForm()
              } catch (err) {
                const msg =
                  err?.response?.data?.message || 'Could not reset password. Try again.'
                setStatus({ tone: 'error', message: msg })
              } finally {
                helpers.setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-5 space-y-3">
                <TextField name="token" label="Reset token" placeholder="Paste token here" />
                <TextField
                  name="password"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <TextField
                  name="confirmPassword"
                  label="Re-enter new password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Updating…' : 'Update password'}
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

