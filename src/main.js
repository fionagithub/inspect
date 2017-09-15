// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================
import moment from 'moment'
import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './config/store'
import feathersClient from './api/feathers-config'
import './config/filters'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
moment.locale('zh-cn');
Vue.use(Quasar) // Install Quasar Framework
// window.screen.lockOrientation('portrait')
// setInterval authenticate
window.feathers=feathersClient

import {
  mapActions,
  mapState
} from 'vuex'
Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    computed:{ 
      ...mapState('auth', ['payload']),
    },
    created(){
      if(this.payload){
        this.getAuth()
      }else{
       this.setAuth()
      }
    },
    methods:{
      ...mapActions('metadata', {
        findStateItems: 'find',
      }),
      getConf(){
        this.findStateItems( ).then(res=>{
          let _array = [{
            value: 'ALL',
            label: '全部状态'
          }] 
            let sum ={}
            for (var item in res) {
              let data = res[item]
              let _list = data['is']
              sum[data['id']]= _list
              if ( data['id']=='state'){
                this.$store.state.stateItems= _list.concat(_array)
              }
            }
              console.log('[-!!!--]', sum) 
              this.$store.state._state=   sum.state
              this.$store.state._priority=sum.priority
              this.$store.state.systemItems=sum.system
        })
      },
      ...mapActions('auth', [
        'authenticate'
      ]),
      setAuth() {
        let _self = this
        _self.authenticate().then((response) => {
          _self.getAuth()
           _self.getConf()
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
