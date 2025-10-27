<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-gutter-sm q-mb-md">
      <div class="text-h6 text-weight-bold q-mr-md">Products</div>
      <q-input v-model="filters.search" dense outlined placeholder="Search" class="col-12 col-sm-5">
        <template #prepend><q-icon name="search" /></template>
        <template #append>
          <q-btn flat dense round icon="close" v-if="filters.search" @click="filters.search=''" />
        </template>
      </q-input>
      <q-space/>
      <q-btn color="primary" unelevated icon="add" label="New product" @click="openPopup" />
    </div>

    <q-card flat bordered class="bg-white shadow-1">
      <q-table
        flat dense
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        :rows-per-page-options="[10,20,50]"
        :rows-number="total"
      >
        <template #top-right>
          <q-chip square color="grey-3" text-color="dark" size="sm">
            {{ total }} results
          </q-chip>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props" class="text-no-wrap">
            {{ $convertCurrency(props.row.price) }}
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense flat round icon="edit" @click="openPopup(props.row)" />
            <q-btn dense flat round icon="delete" color="negative" :loading="deletingId===props.row.id" @click="confirmDelete(props.row)" />
          </q-td>
        </template>

        <template #no-data>
          <div class="q-pa-md text-grey-7">No products</div>
        </template>
      </q-table>
    </q-card>

    <ProductDialog
      v-model="dialog.open"
      :mode="dialog.mode"
      :productValue="dialog.productValue"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch} from 'vue'
import { useQuasar, debounce } from 'quasar'
import { useSearchStore } from 'stores/search.js'
import { useProductsStore } from 'stores/products'

import ProductDialog from 'components/products/ProductDialog.vue'

const $q = useQuasar()
const productsStore = useProductsStore()
const searchStore = useSearchStore()

const loading = ref(false)
const deletingId = ref(null)
const total = ref(0)

const filters = reactive({ search: '' })

const columns = [
  { name: 'name', label: 'Product Overview', field: 'name', align: 'left', sortable: true },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right', sortable: true },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center', sortable: true },
  { name: 'price', label: 'Unit Price', field: 'price', align: 'right', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'center' },
  { name: 'actions', label: '', field: 'id', align: 'right' }
]

const rows = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  descending: false
})
const dialog = reactive({ open: false, mode: 'create', productValue: null })
const debouncedFetch = debounce(fetchRows, 250)

onMounted(() => {
  fetchRows()
})

watch(() => filters.search, () => debouncedFetch())
watch(pagination, fetchRows, { deep: true })

function fetchRows () {
  loading.value = true
  searchStore.search({
    support: 'product',
    page: pagination.value.page,
    perPage: pagination.value.rowsPerPage
  }).then((response) => {
    rows.value = response.data ?? []
    total.value = Number(response.total ?? rows.value.length)
  }).catch((error) => {
    $q.notify({ type: 'negative', message: 'Load error', caption: error?.message })
  }).finally(() => {
  loading.value = false
  })
}
function openPopup (product = null) {
  dialog.mode = product === null ? 'create' : 'edit'
  dialog.productValue = product === null ? null : product
  dialog.open = true
}
function handleSave (payload) {
  if (dialog.mode === 'create') {
    productsStore.createProduct(payload).then(() => {
      $q.notify({ type: 'positive', message: 'Created Successfully' })
      fetchRows()
      dialog.open = false
    }).catch(() => {
      $q.notify({ type: 'negative', message: 'Create error' })
    })
  } else {
    productsStore.updateProduct({ ...dialog.productValue, ...payload }).then(() => {
      $q.notify({ type: 'positive', message: 'Updated Successfully' })
      fetchRows()
      dialog.open = false
    }).catch(() => {
      $q.notify({ type: 'negative', message: 'Updated error' })
    })
  }
}
function confirmDelete (row) {
  $q.dialog({
    title: 'Delete product',
    message: `Delete "${row.name}" ?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    deletingId.value = row.id
    productsStore.deleteProduct({ id: row.id }).then(async () => {
      await fetchRows()
      $q.notify({ type: 'positive', message: 'Deleted Successfully' })
    }).catch(() => {
      $q.notify({ type: 'negative', message: 'Deleted error' })
    }).finally(() => {
      deletingId.value = null
    })
  })
}
</script>

<style scoped>
.q-table :deep(thead th) { font-weight: 600; }
</style>
