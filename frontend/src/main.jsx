import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Import semua halaman
import Layout    from './components/Layout'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products  from './pages/Products'
import Customers from './pages/Customers'
import Sales     from './pages/Sales'

import './index.css'

// Komponen penjaga: hanya izinkan masuk kalau sudah login
// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Masih cek token, tampilkan loading dulu
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-500">
        Memuat...
      </div>
    )
  }

  // Belum login? Redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Halaman publik */}
          <Route path="/login" element={<Login />} />

          {/* Halaman yang butuh login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Kalau buka "/", redirect ke "/dashboard" */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products"  element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="sales"     element={<Sales />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)