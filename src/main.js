require(`./themes/app.${__THEME}.styl`)
import Vue from 'vue'
import Quasar from 'quasar'
import { Platform,Toast } from 'quasar'
import router from './router'
import store from './config/vuex/store'
import './jpush'
import './config/filters'
import Vuelidate from 'vuelidate'
import './assets/css/index.css'
import err from './components/Error'
import feathersClient from './config/feathers-config'
import filtersStorage from './config/storage'

window.filtersStorage = filtersStorage
window.feathersClient = feathersClient
Vue.component('err', err);
window.Platform = Platform.is;
window.isIndex = true 
Vue.use(Vuelidate)
Vue.use(Quasar) 

window.jpushUri = {path:null}
//app初始化完成打开通知栏消息
window.InitJpush = true
window.tenantid= filtersStorage('tenantid'),
window.protocolId= filtersStorage('protocolId'),
window.apiServer= filtersStorage('apiServer')
Quasar.start(() => {
  new Vue({
    el: '#q-app', 
    data:{
      jpushUri:window.jpushUri,
    },
    created(){
      if( window.tenantid && window.apiServer && window.protocolId){
        this.$router.push('/')
      }else{
         this.$router.push('/config')
      }
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

 