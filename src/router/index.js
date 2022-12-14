import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/components/MainPage.vue'
import CheckoutPage from '@/components/payment/CheckoutPage.vue'
import JsonEditor from '@/components/jsonEditor/jsonEditor.vue'
import graphsMainPage from '@/components/graphs/graphsMainPage.vue'

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
    {
      path: '/jsoneditor',
      component: JsonEditor,
      meta: {
        title: 'JSON Editor'
      }
    },
    {
      path: '/graphs',
      component: graphsMainPage,
      meta: {
        title: 'Graphs Test'
      }
    }
  ]
})

router.afterEach((to, from) => {
  document.title = to.meta.title || '404 Error'
})

export default router