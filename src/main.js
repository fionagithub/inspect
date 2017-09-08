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
import './api/feathers-config'
  import moment from 'moment'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.use(Quasar) // Install Quasar Framework
// window.screen.lockOrientation('portrait')
// setInterval authenticate

Vue.filter('date', function(date) {
    let _format
    let fmt = 'YYYYMMDD'
    let _Now = moment().format(fmt)
    let _date = moment(date).format(fmt)
    if (parseInt(_Now) == parseInt(_date)) {
      _format = '[今天] HH:mm'
    } else {
      let num = Math.pow(10, 4)
      if (parseInt(_Now / num) == parseInt(_date / num)) {
        _format = 'M月D日'
      } else {
        _format = 'Y年M月D日'
      }
    }
    return moment(date).format(_format);
})
Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    watch: {
      $route(to, from, next) {
        this.$store.commit('initNav')
        console.log('-call -mutations=')
      }
    }, 
    router, //
    store,
    render: h => h(require('./App'))
  })
})
