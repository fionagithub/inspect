<template>
  <div class="error-page window-height window-width bg-light column items-center">
    <div class="error-code teal flex items-center justify-center">
      <div class="error-card card bg-white column items-center justify-center">
        <i class="text-grey-5">error_outline</i>
        <p class="text-center group">
          <h2>
            认证中...
          </h2>
        </p>
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
export default {
  created(){
    this.setAuth()
  },
  methods: {
    ...mapActions('auth', [
      'authenticate'
    ]),
    setAuth(obj) {
      let io = feathers.io 
      io.disconnect()
      let tenant = filtersStorage('tenant')
      io.io.uri = 'https://' + tenant + '.laputacloud.com'
      io.connect()
      let _self = this
      _self.authenticate().then((response) => {
        // console.log('--!!!:::exp--')
        _self.$router.push('/index')
      }).catch((error) => {
        // console.log('--!!!aaaaa--', error)
        _self.$router.push('/login')
      });
    },
  },
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
    i{
      font-size: 5rem ;
    }
    h2{
      color: black;
    }
</style>
