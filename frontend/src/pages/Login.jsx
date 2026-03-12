import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '320px',
        padding: '2rem',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        margin: '0 1rem',
      }}>

        {/* Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
            Mini ERP
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ fontSize: '13px', color: '#ef4444', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@erp.com"
              required
              style={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                fontSize: '13px',
                color: '#0f172a',
                outline: 'none',
                backgroundColor: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                fontSize: '13px',
                color: '#0f172a',
                outline: 'none',
                backgroundColor: '#fff',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#fff',
              fontWeight: '500',
              fontSize: '13px',
              padding: '0.575rem',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}