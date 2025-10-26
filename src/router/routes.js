const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/products', component: () => import('pages/ProductsPage.vue') },
      { path: '/saleOrder', component: () => import('pages/SaleOrdersPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
