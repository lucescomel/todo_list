import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
})

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((requestConfig) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`
  }
  return requestConfig
})

// Gère le rafraîchissement automatique du token en cas d'erreur 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken })
        localStorage.setItem('access_token', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (credentials) => axios.post(`${BASE_URL}/auth/token/`, credentials),
  refresh: (refreshToken) => axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken }),
}

export const tasksApi = {
  getAll: (category = '') =>
    api.get('/tasks/' + (category ? `?category=${category}` : '')),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
}

export default api
