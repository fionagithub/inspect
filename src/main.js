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
import moment from 'moment'
import err from './components/Error'
import filtersStorage from './components/conf/storage'

Vue.component('err', err);

import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
moment.locale('zh-cn');

Vue.use(Vuelidate)
Vue.use(Quasar) // Install Quasar Framework
// window.screen.lockOrientation('portrait')
// setInterval authenticate
window.feathers = feathersClient
window.filtersStorage=filtersStorage
window.Win_tickets_ = feathers.service('tickets')
window.Win_devices_ = feathers.service('devices')
import {
  Toast
} from 'quasar'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    computed: {
      ...mapState('auth', ['payload']),
      ...mapState(['_error', 'tenant_uri' ]),
    },
    created() {
      let tenant = filtersStorage('tenant')
      if (tenant) {
        let io = feathers.io
        io.io.uri = this.tenant_uri[tenant]
        io.connect()
        this.setAuth()
        this.$router.push('/')
      } else{
        this.$router.push('/login')
      }
    },
    watch: {
      _error(error) {
        if (error) {
          this.handleError(error)
        } else {
          this.setErr()
        }
      },
      payload(obj) {
        if (obj) {
          this.getAuth()
          this.getConf()
        }
      }
    },
    methods: {
      ...mapActions(['setConfMenu', 'setErr', 'getGlbErr']),
      handleError(obj) {
        let uri, tips, err = {
          isFlag: true
        }
        if (obj.error.code == 401) {
          uri = err.loginUri = '认证失败，请重新登录'
        } else {
          tips = err.tips = '哦,服务出错，稍后再试'
        }
        this.getGlbErr(err)
        Toast.create.negative({
          html: tips || uri,
          timeout: 5000
        })
      },
      ...mapActions('system', {
        findSystemItems: 'find',
      }),
      ...mapActions('metadata', {
        findStateItems: 'find',
      }),
      getConf() {
        let query = {
          query: {
            id: {
              $nin: ["system"]
            }
          }
        }
        this.findStateItems(query).then(res => {
          let _array, sum = {}
          for (var item in res) {
            let data = res[item]
            let _list = data['is']
            sum[data['id']] = _list
            if (data['id'] == 'state') {
              _array = [{
                value: 'ALL',
                label: '全部状态'
              }]
              sum._state_ = _list.concat(_array)
            }
          }
          //get system api
          this.setConfMenu(sum)
        })
        this.findSystemItems().then(ress=>{
          // console.log('[]-=', ress)
          let system = [], sum = {}
          for (let s in ress) {
            let _ress = ress[s],
              _system = {}
            for (let k in _ress) {
              let key = k == 'name' ? 'label' : 'value'
              _system[key] = _ress[k]
            }
            system.push(_system)
          }
          sum.system = system
          sum._system_ = system.concat([{
            value: 'ALL',
            label: '全部系统'
          }])
          this.setConfMenu(sum)
        })
      },
      ...mapActions('auth', [
        'authenticate'
      ]),
      setAuth(obj) {
        let _self = this
          _self.authenticate().then((response) => {
              _self.$router.push('/index')
          }).catch((error) => {
              _self.$router.push('/login')
          });
      },
      getAuth() {
        let _self = this
        let Exp_Date = _self.payload.exp;
        let Exp_DAY = moment(parseInt(Exp_Date + '000')).subtract('minutes', 5)
        // let Exp_DAY = moment().add('seconds', 5)
        let time = Exp_DAY - moment()
        //  console.log('--!!!import:::exp--', time)
        setTimeout(() => {
          //   console.log('--!!!import:::setAuth--')
          this.setAuth()
        }, time);
      },
    },
    router, //
    store,
    render: h => h(require('./App'))
  })
})
