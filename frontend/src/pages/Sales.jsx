import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

const inputStyle = {
  width: '100%',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '0.5rem 0.75rem',
  fontSize: '13px',
  outline: 'none',
}

export default function Sales() {
  const [sales,     setSales]     = useState([])
  const [meta,      setMeta]      = useState({})
  const [page,      setPage]      = useState(1)
  const [modal,     setModal]     = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [customers, setCustomers] = useState([])
  const [products,  setProducts]  = useState([])

  const [form, setForm] = useState({
    customer_id: '',
    date: new Date().toISOString().split('T')[0],  // hari ini
    notes: ''
  })

  const [items, setItems] = useState([
    { product_id: '', quantity: 1, price: 0 }
  ])

  const fetchSales = useCallback(() => {
    api.get('/sales', { params: { page } })
      .then(res => { setSales(res.data.data); setMeta(res.data) })
  }, [page])

  useEffect(() => { fetchSales() }, [fetchSales])

  const openModal = () => {
    api.get('/customers', { params: { page: 1, per_page: 1000  } }).then(res => setCustomers(res.data.data))
    api.get('/products',  { params: { page: 1, per_page: 1000  } }).then(res => setProducts(res.data.data))
    setForm({ customer_id: '', date: new Date().toISOString().split('T')[0], notes: '' })
    setItems([{ product_id: '', quantity: 1, price: 0 }])
    setModal(true)
  }

  const addItem = () => {
    setItems(prev => [...prev, { product_id: '', quantity: 1, price: 0 }])
  }

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'product_id') {
        const product = products.find(p => p.id == value)
        if (product) updated[index].price = product.price
      }

      return updated
    })
  }

  const total = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0)
  }, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/sales', { ...form, items })
      fetchSales()
      setModal(false)
    } catch (err) {
      alert(err.response?.data?.message ?? 'Terjadi kesalahan.')
    } finally {
      setSaving(false)
    }
  }

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

  const statusColor = {
    completed: { bg: '#ecfdf5', text: '#059669' },
    pending:   { bg: '#fffbeb', text: '#d97706' },
    cancelled: { bg: '#fef2f2', text: '#dc2626' },
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Penjualan</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Riwayat dan buat transaksi</p>
        </div>
        <button
          onClick={openModal}
          style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Buat Transaksi
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['No. Invoice', 'Pelanggan', 'Tanggal', 'Total', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '11px', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                  Belum ada transaksi
                </td>
              </tr>
            )}
            {sales.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '12px', fontFamily: 'monospace', color: '#334155' }}>
                  {s.invoice_number}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px' }}>
                  {s.customer?.name}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#64748b' }}>
                  {s.date}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', fontWeight: '500' }}>
                  {rupiah(s.total)}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: statusColor[s.status]?.bg,
                    color: statusColor[s.status]?.text,
                  }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
            <span>Halaman {meta.current_page} dari {meta.last_page}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
                Prev
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page}
                style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: page === meta.last_page ? 0.4 : 1 }}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal buat transaksi */}
      {modal && (
        <Modal title="Buat Transaksi Baru" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Pelanggan</label>
                <select
                  value={form.customer_id}
                  onChange={e => setForm(p => ({ ...p, customer_id: e.target.value }))}
                  style={{ ...inputStyle, backgroundColor: '#fff' }}
                  required
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Tanggal</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Item-item */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '12px', color: '#64748b' }}>Item</label>
                <button type="button" onClick={addItem}
                  style={{ fontSize: '12px', color: '#0f172a', background: 'none', border: 'none', cursor: 'pointer' }}>
                  + Tambah Baris
                </button>
              </div>

              {items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <select
                    value={item.product_id}
                    onChange={e => updateItem(i, 'product_id', e.target.value)}
                    style={{ ...inputStyle, backgroundColor: '#fff'}}
                    required
                  >
                    <option value="">-- Produk --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)}
                    placeholder="Qty"
                    style={inputStyle}
                    required
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={e => updateItem(i, 'price', e.target.value)}
                    placeholder="Harga"
                    style={inputStyle}
                    required
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total: </span>
                <span style={{ fontSize: '16px', fontWeight: '600', marginLeft: '8px' }}>
                  {rupiah(total)}
                </span>
              </div>
            </div>

            {/* Catatan */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Catatan (opsional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setModal(false)}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}