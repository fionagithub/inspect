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
Vue.use(Vuelidate)

Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    created(){ 
      let _self = this
       _self.$store.dispatch('auth/authenticate').then((response) => {
          //  _self.$router.push('/')
          console.log('response:::', response)
       }).catch( (error)=> {
            _self.$router.push('/login')
          console.log('Error authenticating!', error);
        });
    },
    watch:{
      $route(to, from, next) {
        this.$store.commit('initNav')
    console.log('-call -mutations=')
      }
    },
    
    router,  //
    store,
    render: h => h(require('./App'))
  })
})
