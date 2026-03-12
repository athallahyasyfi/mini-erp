import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

// Buat "wadah" context
const AuthContext = createContext(null)

// Provider: komponen yang membungkus seluruh aplikasi
// dan menyediakan data auth ke semua komponen di dalamnya
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)     // data user yang login
  const [loading, setLoading] = useState(true)     // sedang cek token atau tidak

  // Saat aplikasi pertama dibuka, cek apakah ada token tersimpan
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Kalau ada token, verifikasi ke backend
      api.get('/me')
        .then(res => setUser(res.data))
        .catch(() => {
          // Token tidak valid, hapus saja
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('token', res.data.token)  // simpan token
    setUser(res.data.user)
  }

  const logout = async () => {
    try {
      await api.post('/logout')  // hapus token di backend
    } finally {
      localStorage.removeItem('token')  // hapus token di browser
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook supaya mudah dipakai: const { user } = useAuth()
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)