import filtersStorage from './config/storage'
window.filtersStorage=filtersStorage
window.__tenantId__ = filtersStorage('tenantid');
if(!window.__tenantId__){
  window.location.replace('setting.html')
}


require(`./themes/app.${__THEME}.styl`)
import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './config/store'
import  feathersClient from './api/feathers-config'

import './config/filters'
import Vuelidate from 'vuelidate'
import './assets/css/index.css'
import err from './components/Error'

Vue.component('err', err);

import {
  mapActions
} from 'vuex'

Vue.use(Vuelidate)
Vue.use(Quasar) 

window.feathers = feathersClient(window.__tenantId__)
window.Win_devices_ = feathers.service('devices')
Quasar.start(() => {
  new Vue({
    el: '#q-app', 
    created() {
     // this.setAuth()
        this.$router.push('/')
   //   console.log('[][]323232')
    },
    methods: {
      ...mapActions('auth', [
        'authenticate'
      ]),
      setAuth() {
        let _self = this
        _self.authenticate().then((response) => {
           _self.$router.push('/index')
        }).catch((error) => {
           _self.$router.push('/login')
        });
      },
    },
    router, //
    store,
    render: h => h(require('./App'))
  })
})
