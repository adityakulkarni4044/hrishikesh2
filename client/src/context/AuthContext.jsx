import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { clearToken, getToken, setToken } from '../lib/token.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refreshMe() {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await api.get('/api/auth/me')
      setUser(res.data.user)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login({ role, email, password }) {
    const res = await api.post('/api/auth/login', { role, email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  async function register({ role, name, phone, email, password, confirmPassword }) {
    const res = await api.post('/api/auth/register', {
      role,
      name,
      phone,
      email,
      password,
      confirmPassword,
    })
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  async function logout() {
    clearToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshMe,
      login,
      register,
      logout,
      isAuthed: !!user,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

