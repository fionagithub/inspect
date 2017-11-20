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
import moment from 'moment'
moment.locale('zh-cn');
export default {
  computed: {
    ...mapState('auth', ['payload']),
    ...mapState(['_error']),
  },
  watch: {
    _error(error) {
      if (error) {
        this.handleError(error)
      } else {
        this.setErr()
      }
    },
    payload(obj) {
      if (obj) {
        this.getAuth()
  //  this.getConf()
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'authenticate'
    ]),
    ...mapActions(['setConfMenu', 'setErr', 'getGlbErr']),
    setAuth(obj) {
      let _self = this
      _self.authenticate().then((response) => {
      }).catch((error) => {
        _self.$router.push('/login')
      });
    },
    getAuth() {
      let _self = this
      let Exp_Date = _self.payload.exp;
      let Exp_DAY = moment(parseInt(Exp_Date + '000')).subtract('minutes', 5)
      // let Exp_DAY = moment().add('seconds', 5)
      let time = Exp_DAY - moment()
      //  console.log('--!!!import:::exp--', time)
      setTimeout(() => {
        //   console.log('--!!!import:::setAuth--')
        this.setAuth()
      }, time);
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
