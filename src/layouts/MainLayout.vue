<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="q-px-md">
        <q-btn flat dense round icon="menu" @click="leftOpen = !leftOpen" />
        <q-separator vertical inset class="q-mx-sm" />
        <div class="text-subtitle1 text-weight-bold">ERP STOCK</div>
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-avatar size="28px" class="q-ml-sm"><img src="https://i.pravatar.cc/60?img=15"></q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftOpen" show-if-above side="left" bordered class="bg-grey-1">
      <q-list padding>
        <q-item to="/dashboard" clickable v-ripple active-class="active-link">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item to="/products" clickable v-ripple active-class="active-link">
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section>Products</q-item-section>
        </q-item>
        <q-item to="/purchases" clickable v-ripple active-class="active-link">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Purchases</q-item-section>
        </q-item>
        <q-item to="/sales" clickable v-ripple active-class="active-link">
          <q-item-section avatar><q-icon name="local_shipping" /></q-item-section>
          <q-item-section>Sales</q-item-section>
        </q-item>
        <q-item to="/stock" clickable v-ripple active-class="active-link">
          <q-item-section avatar><q-icon name="warehouse" /></q-item-section>
          <q-item-section>Stock</q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { refreshApiInstance } from 'boot/axios'

const leftOpen = ref(true)

onBeforeMount(() => {
  refreshApiInstance()
})

function logout () {
  localStorage.removeItem('erp_token')
  localStorage.removeItem('erp_user')
  window.location.href = '#/login'
}
</script>

<style scoped>
.active-link {
  background: rgba(99,102,241,.12);
  border-right: 3px solid #6366f1;
}
</style>
