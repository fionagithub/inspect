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
import Vuelidate from 'vuelidate'
 import { Toast } from 'quasar'
Vue.use(Vuelidate)

Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    created(){ 
       this.$store._actions['auth/authenticate'][0]().then(response => {
         Toast.create('登录成功.')
          console.log('response:::', response)
            this.$router.push('/')
       }).catch(function (error) {
         Toast.create('登录出错.')
            this.$router.push('/login')
          console.error('Error authenticating!', error);
        });
    },
    router,  //
    store,
    render: h => h(require('./App'))
  })
})
