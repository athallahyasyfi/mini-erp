import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

// Data form kosong
const EMPTY_FORM = {
  code: '', name: '', description: '',
  category: '', price: '', stock: '', unit: 'pcs'
}

// Style untuk input yang konsisten
const inputStyle = {
  width: '100%',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '0.5rem 0.75rem',
  fontSize: '13px',
  outline: 'none',
  backgroundColor: '#fff',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#64748b',
  marginBottom: '6px'
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [meta,     setMeta]     = useState({})
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [modal,    setModal]    = useState(null)   // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)

  // Fungsi fetch data — dibungkus useCallback supaya bisa dipakai di useEffect
  const fetchProducts = useCallback(() => {
    api.get('/products', { params: { search, page } })
      .then(res => {
        setProducts(res.data.data)    // array produk
        setMeta(res.data)             // info pagination (current_page, last_page, dll)
      })
  }, [search, page])

  // Jalankan fetchProducts setiap kali search atau page berubah
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setModal('add')
  }

  const openEdit = (product) => {
    setSelected(product)
    setForm({
      code: product.code,
      name: product.name,
      description: product.description ?? '',
      category: product.category ?? '',
      price: product.price,
      stock: product.stock,
      unit: product.unit,
    })
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        await api.post('/products', form)
      } else {
        await api.put(`/products/${selected.id}`, form)
      }
      fetchProducts()   // refresh tabel
      closeModal()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Terjadi kesalahan.'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0
    }).format(n)

  return (
    <div>
      {/* Header halaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Produk</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Kelola stok dan harga produk</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            backgroundColor: '#0f172a', color: '#fff',
            border: 'none', borderRadius: '6px',
            padding: '0.5rem 1rem', fontSize: '13px',
            cursor: 'pointer', fontWeight: '500'
          }}
        >
          + Tambah Produk
        </button>
      </div>

      {/* Tabel */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama atau kode produk..."
            style={{ ...inputStyle, width: '260px' }}
          />
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Kode', 'Nama', 'Kategori', 'Harga', 'Stok', ''].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                  Tidak ada produk
                </td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                  {p.code}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', fontWeight: '500' }}>
                  {p.name}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#64748b' }}>
                  {p.category || '-'}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#334155' }}>
                  {rupiah(p.price)}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    color: p.stock < 10 ? '#ef4444' : '#334155',
                    fontWeight: p.stock < 10 ? '600' : '400'
                  }}>
                    {p.stock} {p.unit}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ fontSize: '12px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.75rem 1rem', borderTop: '1px solid #f1f5f9',
            fontSize: '12px', color: '#94a3b8'
          }}>
            <span>Halaman {meta.current_page} dari {meta.last_page}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === meta.last_page}
                style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', opacity: page === meta.last_page ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal tambah/edit */}
      {modal && (
        <Modal
          title={modal === 'add' ? 'Tambah Produk' : 'Edit Produk'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Kode Produk</label>
                <input name="code" value={form.code} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Nama Produk</label>
                <input name="name" value={form.name} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Harga (Rp)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Stok</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Satuan</label>
                <input name="unit" value={form.unit} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <input name="category" value={form.category} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={closeModal}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}