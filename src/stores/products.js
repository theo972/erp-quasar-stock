import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios.js'

export const useProductsStore = defineStore('products', () => {
  function getDashboard (credentials) {
    return new Promise((resolve, reject) => {
      return api.get('products/dashboard',credentials).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  return {
    getDashboard
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot))
}
