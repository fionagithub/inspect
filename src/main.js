import filtersStorage from './config/storage'
window.filtersStorage=filtersStorage
window.__tenantId__ = filtersStorage('tenantid');
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
window.feathers = feathersClient(window.__tenantId__)
window.Win_devices_ = feathers.service('devices')
window.Win_tickets_ = feathers.service('tickets')

var onOpenNotification=function(event) {
  try {
    let content;
    if (window.Platform == "android") {
      content = JSON.parse(event.alert);
    } else {
      content = JSON.parse(event.aps.alert);
    }
    let url='/'+content.type+'/'+content.id
    window.jpushUri.path=url
    
  } catch (exception) {
    console.log("JPushPlugin:onOpenNotification==============" + exception);
  } 
};

document.addEventListener("jpush.openNotification", onOpenNotification, false);

Quasar.start(() => {
  new Vue({
    el: '#q-app', 
    created() {
      // test jpush url
    },
    data:{
      jpushUri:window.jpushUri,
    },
    watch:{
      jpushUri: {
        handler(val, oldVal) {
          if(val.path){
           // window.jpushFlag.changeUri=true
           let that = this
           setTimeout(function(){
            console.log('-------', val)
              that.$router.push(window.jpushUri.path)
            }, 1000)
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

 