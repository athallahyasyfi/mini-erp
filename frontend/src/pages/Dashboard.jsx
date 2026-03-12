import { useState, useEffect } from 'react'
import api from '../api/axios'

// Komponen kartu statistik kecil
function StatCard({ label, value, note }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1.25rem'
    }}>
      <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>{value}</p>
      {note && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{note}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#94a3b8', fontSize: '14px' }}>Memuat...</p>
  if (!data)   return <p style={{ color: '#ef4444', fontSize: '14px' }}>Gagal memuat data.</p>

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(n)

  // Nilai maksimum untuk skala bar chart
  const maxSales = Math.max(...(data.sales_chart.map(r => r.total) || [1]), 1)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Ringkasan bulan ini</p>
      </div>

      {/* Kartu statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Pendapatan" value={rupiah(data.total_revenue)} note="Bulan ini" />
        <StatCard label="Transaksi"  value={data.total_orders}          note="Bulan ini" />
        <StatCard label="Produk"     value={data.total_products}        note={`${data.low_stock} stok rendah`} />
        <StatCard label="Pelanggan"  value={data.total_customers} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Chart penjualan */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '1rem' }}>Penjualan 7 Hari Terakhir</p>
          {data.sales_chart.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Belum ada data penjualan.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.sales_chart.map(row => (
                <div key={row.date} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', width: '90px', flexShrink: 0 }}>
                    {String(row.date).substring(0, 10)}
                  </span>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(row.total / maxSales) * 100}%`,
                      backgroundColor: '#0f172a',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', width: '90px', textAlign: 'right', flexShrink: 0 }}>
                    {rupiah(row.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top produk */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '1rem' }}>Produk Terlaris</p>
          {data.top_products.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Belum ada transaksi.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.top_products.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#cbd5e1', fontFamily: 'monospace', width: '16px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '13px', color: '#0f172a' }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                    {p.total_qty} terjual
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}