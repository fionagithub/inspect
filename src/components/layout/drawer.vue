<template>

  <q-drawer ref="leftDrawer" class="drawer">
      <div class="toolbar">
        <div class="user">
          <img src="../img/mountains.jpg">
          <div class="name" v-if='user' >
            {{user.name}}
          </div>
        </div>
      </div>

      <div class="list no-border platform-delimiter">
        <q-drawer-link icon="tab" disabled to="/">
          我
        </q-drawer-link>
        <q-drawer-link icon="compare_arrows" :to="{path: '/index', query: { _modal: 'Setting' }}">
           设置
        </q-drawer-link>
        <q-drawer-link icon="compare_arrows" disabled to="/">
           消息
        </q-drawer-link>
        <q-drawer-link icon="build" :to="{path: '/index', query: { _modal: 'getFd' }}"  >
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
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
  import {
    Dialog
  } from 'quasar'
  export default {
    name: "drawer", 
    computed: {
      ...mapState('auth', ['user']),
    }, 
    methods: {
      ...mapActions('auth', [
        'logout'
      ]),
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
      getDetail() {
       // console.log('---dre')
      },
      login_out() {
        this.logout().then(() => {
          localStorage.clear()
          this.$router.push({
            path: '/login'
          })
          feathers.io.disconnect()
          this.$refs.leftDrawer.close()
        })

      }
    }
  }

</script>
<style scoped>
  .user .name {
    text-align: center;
    margin: 10px 0;
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
