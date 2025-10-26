<template>
  <div class="chart-wrapper">
    <component :is="chartComp" :data="data" :options="mergedOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie, Bar, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale
} from 'chart.js'

ChartJS.register(
  Title, Tooltip, Legend,
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale
)

const props = defineProps({
  type: { type: String, default: 'bar' },
  data: { type: Object, required: true },
  options: { type: Object, default: () => null },
  height: { type: [Number, String], default: 280 }
})

const chartMap = { pie: Pie, bar: Bar, line: Line, doughnut: Doughnut }
const chartComp = computed(() => chartMap[props.type.toLowerCase()] || Bar)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 14 } },
    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#fff' }
  }
}

const mergedOptions = computed(() => {
  if (!props.options || Object.keys(props.options).length === 0) {
    return defaultOptions
  }
  return {
    ...defaultOptions,
    ...props.options,
    plugins: {
      ...defaultOptions.plugins,
      ...(props.options.plugins || {})
    }
  }
})
</script>


<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: v-bind(height + 'px');
}
</style>
