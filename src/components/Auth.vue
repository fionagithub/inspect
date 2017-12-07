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

 
    import { Platform,Toast } from 'quasar'

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
    ...mapActions([ 'setJpushData' ]),
    setAuth(obj) {
      let _self = this, uriQuery= this.$route.query
         console.log('-----AUTH----', _self.$route)
      _self.authenticate().then((response) => {
          let url=uriQuery.redirect||'/index'
         _self.$router.push(url)
      }).catch((error) => {
        let url={path:'/login'}
        url.query= uriQuery
         _self.$router.push(url)
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
    h5{
      color: black;
    }
</style>
