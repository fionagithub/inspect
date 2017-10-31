<template>
  <!-- root node required -->
  <div class="layout-view">
    <div class="login">
      <div class="card">
        <div class="card-media">
          <img src="../assets/bj_logo.png">
        </div>
        <div class="card-content user">
          <div class="item two-lines">
            <div class="item-content row items-center nowrap">
              <div class="stacked-label">
                <input disabled class="full-width" v-model="tenant">
                <label> {{holderTitle.tenant}}</label>
              </div>
            </div>
              <i class="item-primary conf-icon " @click="setTenant">edit</i>
          </div> 
          <div class="item two-lines">
            <div class="item-content row items-center nowrap">
              <div class="floating-label">
                <input required class="full-width" v-model="users">
                <label> {{holderTitle.user}}</label>
              </div>
            </div>
          </div>  
          <div class="item two-lines">
            <div class="item-content row items-center nowrap">
              <div class="floating-label">
                <input required class="full-width" v-model="pwd" type="password" v-if="showPsd">
                <input required class="full-width" v-model="pwd" type="text" v-if="!showPsd">
                <label> {{holderTitle.pwd}}</label>
              </div>
            </div>
              <i class="item-primary conf-icon " @click="changePwd">visibility</i>
          </div>  
          <div class="login-btn">
            <q-progress-button :disabled="unAddBtn" :percentage="progressBtn" @click.native="login()" indeterminate class="teal circular big">
              登录
            </q-progress-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  
  import {
    Toast
  } from 'quasar'
  import {
    mapActions,
    mapState
  } from 'vuex'
  export default {
    data() {
      return { 
       /* users: 'jkr3',
         pwd: 'laputa', */ 
         users: '',
         pwd: '',
        showPsd: true,
        flag: false, 
        progressBtn: 0,
        tenant: filtersStorage('tenantid'),
        holderTitle: {
          tenant: '企业',
          user: '用户名',
          pwd: '密码',
        }
      }
    },
    mounted() {
    },
    computed: {
      unAddBtn() { 
        return this.flag == true ? true : false
      }
    },
    methods: {
      ...mapActions('auth', [
        'authenticate'
      ]),
      changePwd() {
        this.showPsd = !this.showPsd
      },
      setTenant(){
        window.location.replace('setting.html')
      },
      login() {
        let self = this
     //    console.log('[]', self)
        let user = {
          strategy: 'local',
          loginId: self.users,
          password: self.pwd
        }
        self.flag = true
        self.progressBtn = 1
        self.authenticate(user).then(response => {
          self.flag = false
          self.progressBtn = 0
          Toast.create({
            html: '登录成功.',
            timeout: 3000
          })
          //  console.log('response:::', response)
          self.$router.push('/index')
        }).catch(function (error) {
            self.flag = false
            self.progressBtn = 0
            Toast.create.negative({
              html:error,
              timeout: 13000
            })
            console.error('Error [--authenticating!', error);
        });
      }
    }
  }

</script>

<style>
  .login {
    height: 100vh;
  }
  
  .login .user {
    padding: 20px 50px;
  }


  .login .card {
    height: 100vh;
    margin: 0;
  }

  .login .item-lines {
    padding: 10px;
  }

  .login .item-label {
    margin-right: 10px;
    width: 60px;
  }

  .login .login-btn {
    padding: 50px;
    display: flex;
    justify-content: center;
  }
  .conf-icon{
    right: 4px;
    font-size: 1rem;
    left: auto!important;
  } 
</style>
