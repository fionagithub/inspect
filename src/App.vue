<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import {
  mapActions,
  mapState
} from 'vuex'
import {
  Toast
} from 'quasar'
export default {
  computed: {
    ...mapState(['_error']),
  },
  watch:{
      _error(error,oldVal) {
          if(error){
            this.handleError(error)
          }
      }, 
  },
  methods:{
    ...mapActions(['getGlbErr']),
    handleError(obj) {
      let uri, tips, err = {
        isFlag: true
      }
      if (obj.error.code == 401) {
        uri = err.loginUri = '认证失败，请重新登录'
      } else {
        tips = err.tips = '哦,服务出错，稍后再试'
      }
      let msg
      if(String(obj.error)=="Error: Socket connection timed out"){
          msg="服务连接错误"
      }else{
        msg= '登录出错，请稍后再试'
      }
      console.log(String(obj.error))
      this.getGlbErr(err)
      Toast.create.negative({
        html: tips || uri,
        timeout: 5000
      })
    },  
  }   
}   
</script>
<style></style>
