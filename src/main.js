// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================
import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './config/store'
import feathersClient from './api/feathers-config'
import './config/filters'
import Vuelidate from 'vuelidate'
import './assets/css/index.css'
import err from './components/Error'
import filtersStorage from './components/conf/storage'

Vue.component('err', err);

import {
  mapActions
} from 'vuex'

Vue.use(Vuelidate)
Vue.use(Quasar) // Install Quasar Framework
// window.screen.lockOrientation('portrait')
// setInterval authenticate
window.feathers = feathersClient
window.filtersStorage=filtersStorage
window.Win_tickets_ = feathers.service('tickets')
window.Win_devices_ = feathers.service('devices')
Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    created() {
      let io = feathers.io
      let tenant = filtersStorage('tenant')
      if (tenant) {
        io.io.uri = 'http://' + tenant + '.laputacloud.com'
        io.connect()
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    },
    router, //
    store,
    render: h => h(require('./App'))
  })
})
