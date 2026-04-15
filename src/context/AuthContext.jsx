// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [token, setToken] = useState(() => localStorage.getItem('afya_token') ?? null)
  
  const [doctor, setDoctor] = useState(() => {
    const saved = localStorage.getItem('afya_doctor')
    
    // Safe parsing with error handling
    if (!saved) return null
    
    try {
      const parsed = JSON.parse(saved)
      console.log('Loaded doctor from localStorage:', parsed)
      return parsed
    } catch (error) {
      console.error('Failed to parse doctor data from localStorage:', error)
      console.error('Raw data:', saved)
      // Clear corrupted data
      localStorage.removeItem('afya_doctor')
      return null
    }
  })

  const isAuthenticated = !!token

  // Clear session 
  const clearSession = useCallback(() => {
    setToken(null)
    setDoctor(null)
    localStorage.removeItem('afya_token')
    localStorage.removeItem('afya_doctor')
  }, [])

  // Logout 
  const logout = useCallback(() => {
    clearSession()
    navigate('/login')
  }, [clearSession, navigate])

  // Register the 401 handler with the API client
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      navigate('/login', { replace: true, state: { reason: 'expired' } })
    })
    return () => setUnauthorizedHandler(null)
  }, [clearSession, navigate])

  // Login 
  const login = useCallback(async (credentials) => {
    try {
      const res = await authApi.login(credentials)
      const jwt = res.data?.accessToken ?? res.accessToken
      const profile = res.data?.doctor ?? res.doctor ?? res.data ?? res

      setToken(jwt)
      setDoctor(profile)
      localStorage.setItem('afya_token', jwt)
      localStorage.setItem('afya_doctor', JSON.stringify(profile))
      navigate('/dashboard')
      
      console.log('Doctor profile stored:', profile.full_name)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [navigate])

  // Register 
  const register = useCallback(async (formData) => {
    try {
      const res = await authApi.register(formData)
      const jwt = res.data?.token ?? res.token
      const profile = res.data?.doctor ?? res.doctor ?? res.data ?? res

      setToken(jwt)
      setDoctor(profile)
      localStorage.setItem('afya_token', jwt)
      localStorage.setItem('afya_doctor', JSON.stringify(profile))
      navigate('/login')
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }, [navigate])

  // Update profile locally
  const updateDoctor = useCallback((changes) => {
    setDoctor(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...changes }
      localStorage.setItem('afya_doctor', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ token, doctor, isAuthenticated, login, register, logout, updateDoctor }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}