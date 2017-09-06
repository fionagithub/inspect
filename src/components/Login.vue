<template>
  <!-- root node required -->
  <div class="layout-view">
    <div class="login" >
    <div class="card">
      <div class="card-media">
        <img src="../assets/bj_logo.png">
      </div>
      <div class="card-content">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">用户名:</div>
            <input class="auto" placeholder="user name" v-model="users">
          </div>

        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">密码:</div>
            <input class="auto" v-model="pwd" type="password" v-if="showPsd" >
            <input class="auto" v-model="pwd" type="text" v-if="!showPsd" >
            <i class="item-primary" @click="changePwd" >visibility</i>
          </div>
        </div>
        <div class="login-btn">
          <button class="circular big teal" @click="login()">登录</button>
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
  } from 'vuex'
  export default {
    data() {
      return {
        users: 'jkr3',
        pwd: 'laputa',
        showPsd:true
        
      }
    },
    created() {
    },
    methods: {
      ...mapActions('auth', [
        'authenticate'
      ]),
      changePwd(){
        this.showPsd=!this.showPsd
      },
      login() {
        let user = {
          strategy: 'local',
          loginId: this.users,
          password: this.pwd
        }
        this.authenticate(user).then(response => {
         Toast.create( { html: '登录成功.',timeout: 500})
          console.log('response:::', response)
            this.$router.push('/')
       }).catch(function (error) {
         Toast.create.negative({html: '登录出错.',timeout:500 })
          console.error('Error authenticating!', error);
        });
      }
    }
  }

</script>

<style>
  .login {
    height: 100%;
  }

  .login .card {
    height: 100%;
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

</style>
