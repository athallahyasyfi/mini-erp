import axios from 'axios'

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // alamat backend kita
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor: jalankan kode ini SEBELUM setiap request dikirim
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')  // ambil token dari storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // sisipkan ke header
  }
  return config
})

// Interceptor: jalankan kode ini saat ada RESPONSE yang masuk
api.interceptors.response.use(
  (response) => response,  // kalau sukses, lewatkan saja
  (error) => {
    // Kalau dapat 401 (Unauthorized), berarti token tidak valid
    // Paksa logout dan arahkan ke login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api