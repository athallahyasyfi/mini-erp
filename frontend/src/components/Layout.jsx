import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

// Layout membungkus semua halaman yang butuh sidebar
// <Outlet /> adalah tempat konten halaman aktif ditampilkan
export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}