import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

const EMPTY_FORM = {
  code: '',
  name: '',
  email: '',
  phone: '',
  address: '',
}

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
  marginBottom: '6px',
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [meta,      setMeta]      = useState({})
  const [search,    setSearch]    = useState('')
  const [page,      setPage]      = useState(1)
  const [modal,     setModal]     = useState(null)   // null | 'add' | 'edit'
  const [selected,  setSelected]  = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)

  const fetchCustomers = useCallback(() => {
    api.get('/customers', { params: { search, page } })
      .then(res => {
        setCustomers(res.data.data)
        setMeta(res.data)
      })
  }, [search, page])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setModal('add')
  }

  const openEdit = (customer) => {
    setSelected(customer)
    setForm({
      code:    customer.code,
      name:    customer.name,
      email:   customer.email   ?? '',
      phone:   customer.phone   ?? '',
      address: customer.address ?? '',
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
        await api.post('/customers', form)
      } else {
        await api.put(`/customers/${selected.id}`, form)
      }
      fetchCustomers()
      closeModal()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Terjadi kesalahan.'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pelanggan ini?')) return
    await api.delete(`/customers/${id}`)
    fetchCustomers()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Pelanggan</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Kelola data pelanggan</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          + Tambah Pelanggan
        </button>
      </div>

      {/* Tabel */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama, kode, atau no. telepon..."
            style={{ ...inputStyle, width: '280px' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Kode', 'Nama', 'Email', 'No. Telepon', ''].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}
                >
                  Tidak ada pelanggan
                </td>
              </tr>
            )}
            {customers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                  {c.code}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', fontWeight: '500' }}>
                  {c.name}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#64748b' }}>
                  {c.email || '-'}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#64748b' }}>
                  {c.phone || '-'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEdit(c)}
                      style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '12px',
            color: '#94a3b8',
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
          title={modal === 'add' ? 'Tambah Pelanggan' : 'Edit Pelanggan'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Kode Pelanggan</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Contoh: CUST-001"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Nama Pelanggan</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label style={labelStyle}>No. Telepon</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Alamat</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Alamat lengkap (opsional)"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '0.5rem 1rem', fontSize: '13px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}