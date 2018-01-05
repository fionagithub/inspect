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
  mapMutations,
  mapState
} from 'vuex'
import {
  Toast
} from 'quasar'
export default {
  data(){
    return{
      tenantid: filtersStorage('tenantid'),
      protocolId: filtersStorage('protocolId'),
      apiServer: filtersStorage('apiServer'),
    }
  },
  computed: {
      ...mapState(['HttpsMap', '_error']),
      ...mapState('auth', [
        'accessToken'
      ]),
  },
  mounted(){
      this.setAuth()
  },
  watch: {
     _error(error,oldVal) {
        if(error){
          this.handleError(error)
        }
    }, 
  },
  methods: {
      ...mapActions(['setConfMenu', 'setErr', 'getGlbErr']),
      ...mapActions('auth', [
        'authenticate'
      ]),
    setAuth() {
      this.authenticate().then((response) => {
        let url={
          path:'/index', 
          query: this.$route.query 
        }
        this.$router.push(url)
      }).catch((error) => {
        this.$router.push('/login')
      });
    },
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
  },
}
</script>

<style></style>
