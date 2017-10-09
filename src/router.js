import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './config/store'
Vue.use(VueRouter)
import {
  Toast
} from 'quasar'

function load(component) {
  return () => System.import(`components/${component}.vue`)
}

const router = new VueRouter({
  routes: [{
      path: '/',
      meta: {
        requiresAuth: true
      },
      component: load('Index')
    },
    {
      path: '/feedback',
      meta: {
        requiresAuth: true
      },
      component: load('Feedback/template')
    },
    {
      path: '/login',
      component: load('Login')
    },
    {
      path: '/ticket',
      meta: {
        requiresAuth: true
      },
      component: load('Ticket/template')
    },
    {
      path: '/device',
      meta: {
        requiresAuth: true
      },
      component: load('Device/template')
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state._error) {
    store.state._error = null
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = localStorage.getItem('feathers-jwt')
    feathers.passport.verifyJWT(token).then(res => {
      next()
    }).catch(error => {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    })
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
