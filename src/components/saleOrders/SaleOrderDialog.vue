<template>
  <q-dialog v-model="model">
    <q-card style="min-width: 860px; max-width: 95vw">
      <q-card-section class="row items-center q-gutter-sm">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md q-pa-lg">
            <q-input class="col-12 col-sm-6" v-model="form.name" label="Order name" dense :rules="[v => !!String(v).trim() || 'Required']" />
            <q-select class="col-12 col-sm-6" v-model="form.status" :options="statusOptions" map-options emit-value dense label="Status" :rules="[v => !!v || 'Required']" />
            <q-input class="col-12" v-model="form.description" label="Description" type="textarea" autogrow dense />
          </div>

          <div class="q-mt-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">Products</div>
              <q-btn dense outline icon="add" label="Add product" @click="addRow" />
            </div>

            <q-markup-table flat bordered separator="cell" class="rounded-borders">
              <thead>
              <tr>
                <th style="width: 42%">Product</th>
                <th style="width: 18%">Price (€)</th>
                <th style="width: 18%">Quantity</th>
                <th style="width: 18%">Subtotal</th>
                <th style="width: 4%"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, id) in form.items" :key="id">
                <td>
                  <q-select
                    v-model="item.product"
                    use-input fill-input hide-selected
                    :options="productOptions"
                    option-value="id" option-label="label"
                    emit-value map-options dense outlined
                    @filter="(val, update) => filterProducts(val, update)"
                    @update:model-value="val => onPickProduct(id, val)"
                    :rules="[v => v || 'Required']"
                    placeholder="Search product"
                  />
                </td>
                <td>
                  <q-input v-model.number="item.price" type="number" dense outlined min="0" :rules="[v => v != null && v >= 0 || '≥ 0']" />
                </td>
                <td>
                  <q-input v-model.number="item.quantity" type="number" dense outlined min="1" :rules="[v => v != null && v >= 1 || '≥ 1']" />
                </td>
                <td class="text-right">
                  {{ $convertCurrency(item.price * item.quantity) }}
                </td>
                <td class="text-center">
                  <q-btn dense flat round icon="delete" color="negative" @click="removeRow(id)" />
                </td>
              </tr>

              <tr v-if="form.items.length === 0">
                <td colspan="5" class="text-grey-7 text-center q-pa-md">No products</td>
              </tr>
              </tbody>

              <tfoot>
              <tr>
                <td colspan="3" class="text-right text-weight-medium">Total</td>
                <td class="text-right text-weight-bold">{{ $convertCurrency(total) }}</td>
                <td></td>
              </tr>
              </tfoot>
            </q-markup-table>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" unelevated label="Save" type="submit" :loading="saving" :disable="saving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, watch, ref } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { useProductsStore } from 'stores/products'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  saleOrderValue: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'save'])
const $q = useQuasar()
const productsStore = useProductsStore()
const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
const title = computed(() => (props.mode === 'edit' ? 'Edit sale order' : 'New sale order'))
const form = reactive({
  name: '',
  description: '',
  status: 'delivery_in_progress',
  items: []
})
const statusOptions = [
  { label: 'Delivery in progress', value: 'delivery_in_progress' },
  { label: 'Received', value: 'received' },
  { label: 'Partially received', value: 'partially_received' },
  { label: 'Cancelled', value: 'cancelled' }
]
const productOptions = ref([])
const saving = ref(false)
const formRef = ref(null)
const total = computed(() =>
  form.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 0)), 0)
)

watch(() => props.saleOrderValue, (val) => { val ? fillForm(val) : resetForm() }, { immediate: true })
watch(() => props.modelValue, (open) => { if (!open) resetForm() })

function resetForm () {
  Object.assign(form, { name: '', description: '', status: 'delivery_in_progress', items: [] })
}
function fillForm (val) {
  Object.assign(form, {
    name: val?.name ?? '',
    description: val?.description ?? '',
    status: val?.status ?? 'delivery_in_progress',
    items: Array.isArray(val?.items)
      ? val.items.map(i => ({
        product: i.product?.id ?? i.product_id ?? i.product ?? null,
        productId: i.product?.id ?? i.product_id ?? i.product ?? null,
        price: Number(i.price ?? 0),
        quantity: Number(i.quantity ?? 1)
      }))
      : []
  })
}
function addRow () {
  form.items.push({ product: null, productId: null, price: 0, quantity: 1 })
}
function removeRow (id) {
  form.items.splice(id, 1)
}
function onPickProduct (index, productId) {
  const item = form.items[index]
  if (!item) return
  item.productId = productId
  const product = productOptions.value.find(product => product.id === productId)
  if (product && product.price != null && (!item.price || item.price === 0)) {
    item.price = Number(product.price)
  }
}

const doFilterProducts = debounce(async (term) => {
  try {
    const data = await productsStore.searchProduct({
      page: 1,
      perPage: 10,
      search: term || undefined
    })
    const items = data.items ?? data.data ?? data.results ?? data ?? []
    productOptions.value = items.map(p => ({
      id: p.id,
      label: `${p.name || 'Unnamed'} — ${p.sku || ('#' + p.id)}`,
      price: p.price ?? null
    }))
  } catch {
    $q.notify({ type: 'negative', message: 'Product search failed' })
  }
}, 300)

function filterProducts (val, update) {
  update(() => doFilterProducts(val))
}

async function onSubmit () {
  if (!formRef.value) return
  const validate = await formRef.value.validate()
  if (!validate) return

  if (!form.items.length) {
    $q.notify({ type: 'warning', message: 'Add at least one product' })
    return
  }

  const validateItems = form.items.find(
    item => !item.product || item.price == null || item.price < 0 || item.quantity == null || item.quantity < 1
  )
  if (validateItems) {
    $q.notify({ type: 'warning', message: 'Each product must have price ≥ 0 and quantity ≥ 1' })
    return
  }

  saving.value = true
  emit('save', {
    name: form.name,
    description: form.description || null,
    status: form.status,
    items: form.items.map(item => ({
      id: Number(item.productId),
      price: Number(item.price),
      quantity: Number(item.quantity)
    }))
  })
  saving.value = false
}
</script>
