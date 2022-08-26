import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/components/MainPage.vue'
import CheckoutPage from '@/components/payment/CheckoutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainPage,
      meta: {
          title: 'Welcome!'
      }
    },
    {
      path: '/paycheck',
      component: CheckoutPage,
      meta: {
        title: 'Checkout'
      }
    },
  ]
})

router.afterEach((to, from) => {
  document.title = to.meta.title || '404 Error'
})

export default router