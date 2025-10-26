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

  function showProduct (payload) {
    return new Promise((resolve, reject) => {
      return api.get('products/', { params: { id: payload.id, } }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function createProduct (payload) {
    return new Promise((resolve, reject) => {
      return api.post('products', payload).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function updateProduct (payload) {
    return new Promise((resolve, reject) => {
      return api.put('products/' + payload.id, payload).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function deleteProduct (payload) {
    return new Promise((resolve, reject) => {
      return api.delete('products/' + payload.id).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  return {
    getDashboard,
    showProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot))
}
