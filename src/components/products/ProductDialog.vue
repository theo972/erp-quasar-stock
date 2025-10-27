<template>
  <q-dialog v-model="model">
    <q-card style="min-width: 520px; max-width: 90vw">
      <q-card-section class="row items-center q-gutter-sm ">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md q-pa-lg">
            <q-input class="col-12" v-model="form.name" label="Name" dense :rules="[v => !!String(v).trim() || 'Required']" />
            <q-input class="col-12 col-sm-6" v-model="form.sku" label="SKU / sku" dense />
            <q-input class="col-12 col-sm-6" v-model.number="form.price" type="number" :min="0" label="Unit price" dense :rules="[v => v == null || v >= 0 || 'Must be ≥ 0']" />
            <q-input class="col-12 col-sm-6" v-model.number="form.quantity" type="number" :min="0" label="Quantity" dense :rules="[v => v == null || v >= 0 || 'Must be ≥ 0']" />
            <q-input class="col-12 col-sm-6" v-model.number="form.stock" type="number" :min="0" label="Stock" dense :rules="[v => v == null || v >= 0 || 'Must be ≥ 0']" />
            <q-input class="col-12" v-model="form.description" label="Description" type="textarea" autogrow dense />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-sm">
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

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  productValue: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'save'])
const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
const title = computed(() =>
  props.mode === 'edit' ? 'Edit product' : 'New product'
)

const form = reactive({
  name: '',
  sku: '',
  price: null,
  quantity: 0,
  stock: 0,
  description: ''
})
const saving = ref(false)
const formRef = ref(null)

function resetForm () {
  Object.assign(form, {
    name: '',
    sku: '',
    price: null,
    quantity: 0,
    stock: 0,
    description: ''
  })
}

function fillForm (val) {
  Object.assign(form, {
    name: val?.name ?? '',
    sku: val?.sku ?? '',
    price: val?.price ?? null,
    quantity: val?.quantity ?? null,
    stock: val?.stock ?? null,
    description: val?.description ?? ''
  })
}

watch(() => props.productValue,
  (val) => {
    if (val) fillForm(val)
    else resetForm()
  },
  { immediate: true }
)

watch(() => props.modelValue,
  (open) => {
    if (!open) resetForm()
  }
)

async function onSubmit () {
  if (!formRef.value) return
  const validate = await formRef.value.validate()
  if (!validate) return
  saving.value = true
  try {
    emit('save', { ...form })
  } finally {
    saving.value = false
  }
}
</script>
