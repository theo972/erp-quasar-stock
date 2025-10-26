<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <div class="logo-dot q-mr-sm"></div>
      <div class="text-h5 text-weight-bold">Tableau de bord</div>
    </div>

    <div class="stat-container">
      <q-card class="stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="inventory_2" size="40px" color="primary" />
          <div class="text-h6 q-mt-sm">Produits</div>
          <div class="text-h4 text-weight-bold text-primary">{{ stats.productsCount }}</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="warehouse" size="40px" color="teal" />
          <div class="text-h6 q-mt-sm">Stock total</div>
          <div class="text-h4 text-weight-bold text-teal">{{ stats.totalStockQty }}</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="shopping_cart" size="40px" color="amber" />
          <div class="text-h6 q-mt-sm">Achats en attente</div>
          <div class="text-h4 text-weight-bold text-amber">{{ stats.openPurchases }}</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card bg-white shadow-1">
        <q-card-section class="text-center">
          <q-icon name="local_shipping" size="40px" color="deep-orange" />
          <div class="text-h6 q-mt-sm">Ventes à expédier</div>
          <div class="text-h4 text-weight-bold text-deep-orange">{{ stats.pendingShipments }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Répartition du stock</div>
          <div v-if="ready" class="chart-wrapper">
            <Pie :data="chartStockData" :options="chartOptions" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Ventes mensuelles</div>
          <div v-if="ready" class="chart-wrapper">
            <Bar :data="chartSalesData" :options="chartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-xl">
      <q-card flat bordered class="bg-white q-pa-md">
        <div class="text-h6 text-weight-medium q-mb-md">Activité récente</div>
        <div v-if="loading" class="text-center text-grey">Chargement...</div>
        <div v-else>
          <div class="chart-wrapper">
            <canvas ref="chartEl"></canvas>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import { useProductsStore } from 'stores/products.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale)

const ready = ref(false)
const $q = useQuasar()
const loading = ref(false)
const chartEl = ref(null)
const productsStore = useProductsStore()
const stats = ref({
  productsCount: 0,
  totalStockQty: 0,
  openPurchases: 0,
  pendingShipments: 0
})
const chartStockData = ref({
  labels: ['Produits', 'Achats', 'Expéditions', 'Stock'],
  datasets: [
    {
      label: 'Répartition',
      data: [12, 8, 5, 20],
      backgroundColor: ['#6366f1', '#22c55e', '#f97316', '#3b82f6']
    }
  ]
})
const chartSalesData = ref({
  labels: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Ventes',
      backgroundColor: '#6366f1',
      data: [15, 25, 18, 30, 40, 35]
    }
  ]
})
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 14 } },
    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#fff' }
  }
}
let activityChart = null

onMounted(loadStats)

function loadStats () {
  loading.value = true
  productsStore.getDashboard().then((data) => {
    stats.value = data
  }).catch(() => {
    $q.notify({ type: 'negative', message: 'Erreur de chargement du tableau de bord' })
  }).finally(async () => {
    loading.value = false
    await nextTick()
    renderChart()
    ready.value = true
  })
}

function renderChart () {
  const ctx = chartEl.value?.getContext('2d')
  if (!ctx) return

  if (activityChart) {
    activityChart.destroy()
  }

  activityChart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Activité',
          data: [5, 12, 9, 14, 20, 17, 10],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  })
}

</script>

<style scoped>
.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #7c3aed;
}
.stat-container {
  display: flex;
  justify-content: space-around;
  .stat-card {
    border-radius: 14px;
    transition: transform 0.15s ease;
    margin: 10px;
    width: 25%;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, .08);
  }
}
.chart-wrapper {
  position: relative;
  height: 280px;
}
</style>
