import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios.js'

export const useSearchStore = defineStore('search', () => {
  function search (payload) {
    return new Promise((resolve, reject) => {
      return api.post('search', payload,{
        params: {
          page: payload.page,
          perPage: payload.perPage
        }
      }).then(({ data }) => {
        resolve(data)
      }).catch((error) => {
        reject(error.response)
      })
    })
  }


  return {
    search
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
