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
moment.locale('zh-cn');
Vue.use(Quasar) // Install Quasar Framework
// window.screen.lockOrientation('portrait')
// setInterval authenticate

Vue.filter('date', function(date,type) {
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
      if(type){
          _format+=' ' + type
      }
    }
          console.log('[]', _format)
    return moment(date).format(_format);
})

import {
  mapActions,
  mapState
} from 'vuex'
Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    watch: {
      $route(to, from, next) {
        console.log('-call -mutations=')
      }
    }, 
    computed:{ 
      ...mapState('auth', ['payload']),
    }, 
    created(){
      if(this.payload){
        this.getAuth()
      }else{
       this.setAuth()
      }
      console.log('-=cc')
    },
    methods:{
      ...mapActions('auth', [
        'authenticate'
      ]),
      setAuth() {
        let _self = this
        _self.authenticate().then((response) => {
          _self.getAuth()
        }).catch((error) => {
          _self.$router.push('/login')
          console.log('Error authenticating!', error);
        });
      },
      getAuth() {
        let _self = this
        let Exp_Date = _self.payload.exp;
        let Exp_DAY =moment(parseInt(Exp_Date +'000')).subtract('minutes', 5)
       // let Exp_DAY = moment().add('seconds', 5)
       let time = Exp_DAY - moment()
        console.log('--!!!import:::exp--', time)
        setTimeout(() => {
          console.log('--!!!import:::setAuth--')
          this.setAuth()
        }, time);
      },
    },
    router, //
    store,
    render: h => h(require('./App'))
  })
})
