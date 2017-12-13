import filtersStorage from './config/storage'
window.filtersStorage=filtersStorage

window.__tenantId__ = filtersStorage('tenantid');
window.protocolId = filtersStorage('protocolId');
window.apiServer = filtersStorage('apiServer');
if(!window.__tenantId__){
  window.location.replace('setting.html')
}

require(`./themes/app.${__THEME}.styl`)
import Vue from 'vue'
import Quasar from 'quasar'
import { Platform,Toast } from 'quasar'
import router from './router'
import store from './config/vuex/store'
import  feathersClient from './config/feathers-config'
import moment from 'moment'
import './jpush'
import './config/filters'
import Vuelidate from 'vuelidate'
import './assets/css/index.css'
import err from './components/Error'
moment.locale('zh-cn');

Vue.component('err', err);
window.Platform=Platform.is;
import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
Vue.use(Vuelidate)
Vue.use(Quasar) 
window.feathers = feathersClient(window.__tenantId__, window.apiServer, window.protocolId)
window.Win_devices_ = feathers.service('devices')
window.Win_tickets_ = feathers.service('tickets')

window.jpushUri={path:null}
//app初始化完成打开通知栏消息
window.InitJpush=true

Quasar.start(() => {
  new Vue({
    el: '#q-app', 
    data:{
      jpushUri:window.jpushUri,
    },
    watch:{
      //app处于启动中，处理打开通知栏消息的方法
      jpushUri: {
        handler(val, oldVal) {
          if(val.path&& window.InitJpush==false ){
            this.$router.push(window.jpushUri.path)
          }
        },
        deep: true
      },
    },
    router, //
    store,
    render: h => h(require('./App'))
  })
})

 