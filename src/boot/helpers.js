import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.config.globalProperties.$app = app

  app.config.globalProperties.$convertCurrency = (price) => {
    if (price == null) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }
})
