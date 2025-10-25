import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios.js'

export const useAuthStore = defineStore('auth', () => {
  function login (credentials) {
    return new Promise((resolve, reject) => {
      return api.post('auth/login_check',credentials).then(({ data }) => {
        localStorage.setItem('erp_token', data.token)
        localStorage.setItem('erp_user', JSON.stringify(data.user || {}))
        resolve()
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function register (user) {
    return new Promise((resolve, reject) => {
      return api.post('auth/register', user).then(({ data }) => {
        resolve(data)
      }).catch((error) => {
        reject(error.response)
      })
    })
  }


  return {
    login,
    register
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
