<template>
  <div class="error-page window-height window-width bg-light column items-center">
    <div class="error-code teal flex items-center justify-center">
      <div class="error-card card bg-white column items-center justify-center">
       <spinner color="#2296a5"  name="bars" :size="30"></spinner>
        <p class="text-center group">
          <h5>
            认证中...
          </h5>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {
 mapActions,
} from 'vuex'
import {
  Toast
} from 'quasar'
export default {
  mounted(){
    window.feathers = feathersClient( window.tenantid, window.apiServer, window.protocolId)
    this.setAuth()
  }, 
  methods:{
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
  }   
}   
</script>
<style lang="stylus">
 .error-code{
    height :50vh;
    width :100%;
    padding-top: 15vh;
    font-size :30vmax;
    color :rgba(255, 255, 255, .2);
    overflow :hidden;
  }
  .error-card{
    margin-top: -25px;
    width: 90vw;
    max-width :600px;
    padding :50px;
  }
    h5{
      color: black;
    }
</style>
