<template>
  <!-- root node required -->
  <div class="layout-view">
    <div class="window-height window-width column items-center justify-center setting">
      <div class="card-content system-config">
        <div class="item two-lines">
          <div class="item-content row items-center nowrap">
            <div class="stacked-label">
              <input  class="full-width" v-model="tenantid">
              <label>   租户编号</label>
            </div>
          </div>
        </div> 
        <div class="item two-lines">
          <div class="item-content row items-center nowrap">
            <div class="stacked-label">
              <input  class="full-width" v-model="apiServer">
              <label>   服务器地址</label>
            </div>
          </div>
        </div> 
        <div class="item two-lines">
          <div class="item-content row items-center nowrap">
            <input type="checkbox" v-model='protocolId' /> 
            HTTPS
          </div>
        </div> 
      </div>    
      <div class="red">{{connectError}}</div>
      <div class="login-btn" v-if="isConfiged" >
        <button @click="step()" class="outline big step">
                下一步
        </button>
      </div>
    </div>
  </div>
</template>
<script> 

import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
let  protocolMap = {
    http:false,
    https:true
  };
 export default {
    data() {
      return {
        tenantid: filtersStorage('tenantid'),
        apiServer: filtersStorage('apiServer'),
        protocolId: protocolMap[filtersStorage('protocolId') || 'http'],
        connectError: '',
      }
    },
   computed:{
     ...mapState(['HttpsMap']),
     isConfiged(){
       let flag = this.tenantid && this.apiServer 
       return flag
     },
   },
   methods:{ 
      ...mapActions(['setFeathersData']),
     step(){
       window.socket && window.socket.close()
       this.connectError = "连接中，请等待..."
       this.setFeathersData(false)
       let protocolId = this.HttpsMap[this.protocolId]
       feathersClient(this.tenantid, this.apiServer, protocolId)
     },
   }
 }

</script>
  <style>
    .setting {
      background: rgba(178, 232, 243, 0.24);
    }
    .system-config{
      width: 300px;
    }
    .login-btn .step {
      right: 0;
      position: fixed;
      bottom: 0;
      margin: 40px;
    }

    .login-btn .cancel {
      left: 0;
      position: fixed;
      bottom: 0;
      margin: 40px;
    }
    #error {
      color: red;
      font-size: .8rem;
      margin: 4px;
    }

  </style>