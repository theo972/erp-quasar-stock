import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, ''),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem('erp_token')
      localStorage.removeItem('erp_user')
      const here = window.location.hash || window.location.pathname
      if (!/\/login$/.test(here)) {
        window.location.href = '#/login'
      }
    }
    return Promise.reject(error)
  }
)

export default defineBoot(({ app, router }) => {
  router.beforeEach((to) => {
    const isPublic = ['/login'].includes(to.path)
    const token = localStorage.getItem('erp_token')
    if (!token && !isPublic) {
      return { path: '/login' }
    }
  })

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
