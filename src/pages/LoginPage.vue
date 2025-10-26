<template>
  <div class="login-page q-pa-md bg-grey-2">
    <q-card flat bordered class="login-card row no-wrap">
      <!-- Left: form -->
      <div class="col-12 col-md-6 q-pa-xl column justify-center">
        <div class="row items-center q-mb-lg">
          <div class="logo-dot q-mr-sm"></div>
          <div class="text-subtitle1 text-weight-medium">ERP STOCK</div>
        </div>

        <div class="q-mb-md">
          <div class="text-h3 text-weight-bold">HELLO,<br />Welcome Back</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Hey, welcome back to your special erp
          </div>
        </div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="email" type="email" label="Email address" autocomplete="email" filled dense :disable="loading" :rules="[v => !!v || 'Required']" />
          <q-input v-model="password" :type="showPwd ? 'text' : 'password'" label="Password" autocomplete="current-password" filled dense :disable="loading" :rules="[v => !!v || 'Required']">
            <template #append>
              <q-icon :name="showPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPwd = !showPwd" />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mt-xs">
            <q-checkbox v-model="remember" label="Remember me" dense :disable="loading" />
            <q-btn flat size="sm" label="Forgot Password?" class="text-grey-7" @click="goForgot" />
          </div>

          <q-btn label="Sign In" type="submit" color="primary" unelevated class="q-mt-sm" :loading="loading" />
        </q-form>

        <div class="q-mt-lg">
          <span class="text-grey-7">Don’t have an account?</span>
          <q-btn flat size="sm" label="Sign Up" @click="goSignup" />
        </div>
      </div>

      <div class="col-6 gt-sm gradient-pane relative-position">
        <div class="pane-content absolute-full">
          <q-img src="public/images/auth.png" class="art" contain />
          <div class="lock-badge">
            <q-icon name="lock" size="24px" />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth.js'
import { refreshApiInstance } from 'boot/axios.js'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPwd = ref(false)
const loading = ref(false)

onBeforeMount(() => {
  refreshApiInstance()
})

onMounted(() => {
  const savedEmail = localStorage.getItem('erp_login_email')
  if (savedEmail) {
    email.value = savedEmail
  }
})

async function onSubmit () {
  if (loading.value) return
  loading.value = true
  authStore.login({ username: email.value, password: password.value }).then(() => {
    if (remember.value) {
      localStorage.setItem('erp_login_email', email.value)
    } else {
      localStorage.removeItem('erp_login_email')
    }

    $q.notify({ type: 'positive', message: 'Welcome back!' })
    router.replace({ path: '/dashboard' })
  }).catch((error) => {
    $q.notify({ type: 'negative', message: 'Login failed', caption: String(error.message || error) })
  }).finally(() => {
    loading.value = false
  })
}

function goForgot () {
  $q.notify({ message: 'Feature coming soon', color: 'grey-8' })
}
function goSignup () {
  $q.notify({ message: 'Contact admin to create an account', color: 'grey-8' })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
.login-card {
  width: 100%;
  max-width: 1080px;
  min-height: 560px;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
}
.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #7c3aed;
}
.gradient-pane {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 40%, #4f46e5 100%);
}
.pane-content .art {
  width: 76%;
  max-width: 560px;
  border-radius: 18px;
  box-shadow: 0 14px 38px rgba(0,0,0,.18);
}
.pane-content {
  display: flex;
  align-items: center;
  width: 50pc;
}
.lock-badge {
  position: absolute;
  right: 28px;
  bottom: 28px;
  background: rgba(255,255,255,.9);
  color: #4f46e5;
  padding: 10px 12px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,.12);
}
@media (max-width: 1023px) {
  .login-card { max-width: 640px; }
}
</style>
