<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <div class="logo-dot q-mr-sm"></div>
      <div class="text-h5 text-weight-bold">Tableau de bord</div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Carte Produits -->
      <q-card class="col-12 col-sm-6 col-md-3 stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="inventory_2" size="40px" color="primary" />
          <div class="text-h6 q-mt-sm">Produits</div>
          <div class="text-h4 text-weight-bold text-primary">{{ stats.productsCount }}</div>
        </q-card-section>
      </q-card>

      <!-- Carte Stock -->
      <q-card class="col-12 col-sm-6 col-md-3 stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="warehouse" size="40px" color="teal" />
          <div class="text-h6 q-mt-sm">Stock total</div>
          <div class="text-h4 text-weight-bold text-teal">{{ stats.totalStockQty }}</div>
        </q-card-section>
      </q-card>

      <!-- Carte Commandes Achat -->
      <q-card class="col-12 col-sm-6 col-md-3 stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="shopping_cart" size="40px" color="amber" />
          <div class="text-h6 q-mt-sm">Achats en attente</div>
          <div class="text-h4 text-weight-bold text-amber">{{ stats.openPurchases }}</div>
        </q-card-section>
      </q-card>

      <!-- Carte Commandes Vente -->
      <q-card class="col-12 col-sm-6 col-md-3 stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="local_shipping" size="40px" color="deep-orange" />
          <div class="text-h6 q-mt-sm">Ventes à expédier</div>
          <div class="text-h4 text-weight-bold text-deep-orange">{{ stats.pendingShipments }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Graphique (optionnel si tu veux du visuel) -->
    <div class="q-mt-xl">
      <q-card flat bordered class="bg-white q-pa-md">
        <div class="text-h6 text-weight-medium q-mb-md">Activité récente</div>
        <div v-if="loading" class="text-center text-grey">Chargement...</div>
        <div v-else>
          <canvas ref="chartEl" style="max-height: 300px"></canvas>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const stats = ref({
  productsCount: 0,
  totalStockQty: 0,
  openPurchases: 0,
  pendingShipments: 0
})
const loading = ref(false)
const chartEl = ref(null)

async function loadStats () {
  loading.value = true
  try {
    const { data } = await api.get('products/dashboard') // <-- ton endpoint back
    stats.value = data
    renderChart()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erreur de chargement du tableau de bord' })
    console.error(e)
  } finally {
    loading.value = false
  }
}

function renderChart () {
  // if (!chartEl.value) return
  // new Chart(chartEl.value, {
  //   type: 'bar',
  //   data: {
  //     labels: ['Produits', 'Stock', 'Achats', 'Ventes'],
  //     datasets: [{
  //       label: 'Indicateurs',
  //       data: [
  //         stats.value.productsCount,
  //         stats.value.totalStockQty,
  //         stats.value.openPurchases,
  //         stats.value.pendingShipments
  //       ],
  //       backgroundColor: ['#7c3aed', '#14b8a6', '#f59e0b', '#f97316']
  //     }]
  //   },
  //   options: { responsive: true, maintainAspectRatio: false }
  // })
}

onMounted(loadStats)
</script>

<style scoped>
.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #7c3aed;
}
.stat-card {
  border-radius: 14px;
  transition: transform 0.15s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,.08);
}
</style>
