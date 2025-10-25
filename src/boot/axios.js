import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const BASE_URL = process.env.API_BASE_URL

function createApiInstance () {
  const token = localStorage.getItem('erp_token')
  const baseURL = token ? `${BASE_URL}api` : BASE_URL

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('erp_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
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

  return instance
}

export const api = createApiInstance()

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

export function refreshApiInstance () {
  Object.assign(api, createApiInstance())
}
