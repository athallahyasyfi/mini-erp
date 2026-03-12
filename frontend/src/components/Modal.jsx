export default function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Klik overlay = tutup modal */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
      />

      {/* Kotak modal */}
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '500px',
        margin: '1rem',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header modal */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{title}</span>
          <button
            onClick={onClose}
            style={{ fontSize: '20px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Konten modal */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}