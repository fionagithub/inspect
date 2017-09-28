import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './config/store'
Vue.use(VueRouter)

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
      path: '/device/:id',
      meta: {
        requiresAuth: true
      },
      component: load('Device/detail')
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let auth = store.state.auth.user
    console.log('--rrt', auth)
    if (!auth) {
        console.log('--lg--')
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
