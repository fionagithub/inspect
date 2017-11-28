import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './config/vuex/store'
import { setError } from './config/vuex/actions'
import {
  Toast
} from 'quasar'
Vue.use(VueRouter)

function load(component) {
  return () => System.import(`components/${component}.vue`)
}

const router = new VueRouter({
  routes: [{
      path: '/',
      component: load('Auth')
    },{
      path: '/index',
      meta: {
        requiresAuth: true
      },
      component: load('Index')
    },
    {
      path: '/setting',
      meta: {
        requiresAuth: true
      },
      component: load('Setting/template')
    },
    {
      path: '/feedback',
      meta: {
        requiresAuth: true
      },
      component: load('Feedback/template')
    },
    {
      path: '/ble',
      component: load('Ble/template')
    },
    {
      path: '/device',
      component: load('device/template')
    },
    {
      path: '/login',
      component: load('Login')
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})

router.beforeEach(function(to, from, next){
  setError(this)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = localStorage.getItem('feathers-jwt')
    feathers.passport.verifyJWT(token).then(res => {
      next()
    }).catch(error => {
      console.log('[]-rrr')
      next({
        path: '/login'
      })
    })
  } else {
    next() // 确保一定要调用 next()
  }
}.bind(store))

export default router
