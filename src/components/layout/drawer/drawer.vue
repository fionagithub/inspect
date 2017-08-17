<template>
  <q-drawer ref="leftDrawer" class="drawer">
    <div class="toolbar">
      <div class="user">
        <img src="../img/mountains.jpg">
        <div class="name" >
          {{getUserInfo}}
        </div>
      </div>
    </div>

    <div class="list">
      <q-drawer-link to="" icon="view_quilt">
        我
      </q-drawer-link>
      <q-drawer-link to="" icon="build">
        设置
      </q-drawer-link>
      <q-drawer-link to="" icon="tab">
        消息
      </q-drawer-link>
      <q-drawer-link to="" icon="compare_arrows">
        反馈
      </q-drawer-link>

    </div>

    <div class="footer">
      <button class="red full-width" @click="login_out()">退出</button>
    </div>

  </q-drawer>
</template>
<script>
  import {
    mapMutations,
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['getUserInfo']),
    },
    methods: {
      ...mapMutations(['out']),
      login_out() {
        this.out()
        this.$router.push({
          path: '/login'
        })
      }
    }

  }

</script>
<style scoped>
  .user .name{
    text-align: center;
    margin: 10px;
  }
  .list .item-link {
    background: 0;
  }

  .drawer .toolbar {
    display: flex;
    min-height: 150px;
    background: gray;
    justify-content: space-around;
  }

  .drawer .list {
    border: 0;
  }

  .user img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .3);
  }

  .fixed-bottom {
    margin-bottom: 1%;
  }

  .fixed-bottom a img {
    width: 25px;
    height: 25px;
  }

  #avatar {
    padding: 20px;
  }

  #profile {
    height: 130px;
    background-color: #009688;
  }

  #user-name {
    left: 90px;
    bottom: 77px;
    position: relative;
    width: 159px;
  }

  #user-actions {
    left: 90px;
    bottom: 71px;
    position: relative;
    width: 171px;
  }

  #menu-collapse {
    margin-top: 5%;
  }

  .footer {
    padding: 10px;
    bottom: 10px;
    position: absolute;
    width: 100%;
  }

</style>
