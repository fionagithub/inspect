<template>
  <div :class="isTipsHG? 'tips-height':''" class='row justify-center tips text-grey'>
    <router-link to='/login' v-if='loginUri'> {{loginUri}} </router-link>
    <span v-else>  {{tips}} </span>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        isTipsHG: false,
        loginUri: null,
        tips: null,
      }
    },
    computed: {
      ...mapState(['_error']),
    },
    watch: {
      _error(error) {
        this.handleError(error)
      },
    },
    methods: {
      handleError(error) {
        if (error.code == 401) {
          this.loginUri = '认证失败，请重新登录'
        } else {
          this.tips = '哦,服务崩溃，稍后再试'
        }
        if ('id' in error) {} else {
          this.$store.state.add_count = {
            tktCut: 0,
            dvCut: 0,
          }
        }
        if (error.ids.length = 0) {
          this.isTipsHG = true
        }
        Toast.create.negative({
          html: this.tips || this.loginUri,
          timeout: 3000
        })
        let type = error.errorType
        error = Object.assign({}, error)
        error.message = (type === 'uniqueViolated') ?
          'That is unavailable.' :
          'An error prevented sign.'
        console.log('-=:[]', error)
      }
    }
  }

</script>

<style>
  .tips {
    align-items: center;
  }

  .tips-height {
    min-height: 60vh;
  }

</style>
