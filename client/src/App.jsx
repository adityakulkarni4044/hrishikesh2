import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx'
import DriverDashboard from './pages/dashboards/DriverDashboard.jsx'
import CustomerDashboard from './pages/dashboards/CustomerDashboard.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute role="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
