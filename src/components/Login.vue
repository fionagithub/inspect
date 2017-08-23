<template>
  <!-- root node required -->
  <div class="login">
    <!-- your content -->
    <div class="card">
      <div class="card-media">
        <img src="../assets/laputa.jpg">
      </div>
      <div class="card-content">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">用户名:</div>
            <input class="auto" placeholder="user name" v-model="user">
          </div>

        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">密码:</div>
            <input class="auto">
          </div>

        </div>
        <div class="login-btn">
          <button class="circular big teal" @click="login()">登录</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    data() {
      return {
        user: '',
        userInfo: ''
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo'
      ])

    },
    methods: {
      ...mapMutations(['setUser']),
      login() {
        this.setUser(this.user)
        this.userInfo = this.getUserInfo || 'root'
        if (this.userInfo) {
          this.$router.push('/')
        }
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
