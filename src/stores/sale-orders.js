import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios.js'

export const useSaleOrderStore = defineStore('saleOrder', () => {
  function searchSaleOrders (payload) {
    return new Promise((resolve, reject) => {
      return api.get('saleOrder/search', {
        params: {
          page: payload.page,
          perPage: payload.perPage
        }
      }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function showSaleOrder (payload) {
    return new Promise((resolve, reject) => {
      return api.get('saleOrder/', { params: { id: payload.id, } }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function createSaleOrder (payload) {
    return new Promise((resolve, reject) => {
      return api.post('saleOrder', payload).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function updateSaleOrder (payload) {
    return new Promise((resolve, reject) => {
      return api.put('saleOrder/' + payload.id, payload).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  function deleteSaleOrder (payload) {
    return new Promise((resolve, reject) => {
      return api.delete('saleOrder/' + payload.id).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }

  return {
    searchSaleOrders,
    showSaleOrder,
    createSaleOrder,
    updateSaleOrder,
    deleteSaleOrder,
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSaleOrderStore, import.meta.hot))
}
