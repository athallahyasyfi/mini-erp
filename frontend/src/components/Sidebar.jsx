import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products',  label: 'Produk' },
  { to: '/customers', label: 'Pelanggan' },
  { to: '/sales',     label: 'Penjualan' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: '220px',
      backgroundColor: '#0f172a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Logo / Brand */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
        <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#64748b', textTransform: 'uppercase' }}>
          Mini ERP
        </span>
      </div>

      {/* Menu navigasi */}
      <nav style={{ flex: 1, padding: '0.75rem' }}>
        {menu.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.6rem 0.75rem',
              borderRadius: '6px',
              fontSize: '14px',
              textDecoration: 'none',
              marginBottom: '2px',
              backgroundColor: isActive ? '#fff' : 'transparent',
              color: isActive ? '#0f172a' : '#94a3b8',
              fontWeight: isActive ? '500' : '400',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Info user dan tombol logout */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: '12px', color: '#475569', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Keluar
        </button>
      </div>
    </aside>
  )
}