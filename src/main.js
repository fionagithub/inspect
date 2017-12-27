window.isMobile = false
var onDeviceReady = function () {
  window.isMobile = true // cordova 成功运行在移动端时，设置移动端的初始值
  initiateUI();
  document.addEventListener("backbutton", function (e) {
    if (location.hash == '#/index'||location.hash == '#/login'||location.pathname=="/setting.html") {
      e.preventDefault();
      navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory()
    }
  }, false);
};

// 获取app key
var getRegistrationID = function () {
  window.JPush.getRegistrationID(onGetRegistrationID);
};
var onGetRegistrationID = function (data) {
  try {
    console.log("JPushPlugin:registrationID is " + data);

    if (data.length == 0) {
      var t1 = window.setTimeout(getRegistrationID, 1000);
    }
    console.log('-----app key id-----', data)
  } catch (exception) {
    console.log(exception);
  }
};
var initiateUI = function () {
  try {
    window.JPush.init();
    window.setTimeout(getRegistrationID, 1000);
    if (window.Platform != "android") {
      window.JPush.setDebugModeFromIos();
      window.JPush.setApplicationIconBadgeNumber(0);
    } else {
      window.JPush.setDebugMode(true);
      window.JPush.setStatisticsOpen(true);
    }
  } catch (exception) {
    console.log(exception);
  }
};
//通知栏打开推送消息
document.addEventListener("deviceready", onDeviceReady, false);

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
window.isIndex=true
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

 