<template>
  <div class="index-page window-height window-width column items-center">
    <div class="banner">
      <div class="toolbar tb-btn">
          <button @click="leftDrawer.open()">
            <i>menu</i>
          </button>
          <button>
            <i>more_vert</i>
            <q-popover ref="popover" anchor="top left" self="bottom left" class="bg-white text-black">
              <div class="list highlight ">
                <div class="item">
                  <button class="defalut" @click="alert()">首页管理 </button>
                </div>
              </div>
            </q-popover>
        </button>
      </div>
    <img class="index-img" src="../assets/img/bj_logo.png">
    </div>
  <div class="index-menu  text-center">

    <div class="row content-center text-center menu-row">
      <div class="auto link-btn" v-for="menu in menus" >
        <router-link :to="menu.uri">
          <button class="teal circular big ">
            {{menu.title}}
          </button>
        </router-link>
      </div>
    </div>
  </div>
  <div slot="footer" class="ftCon" >
      {{verson}}
  </div>
  <drawer></drawer>
  <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
    <feed-back v-if='isFb' />
    <setting v-if='isSetting' />
  </q-modal>
  </div>
</template>

<script>
  import feedBack from './Feedback/template'
  import setting from './Setting/template'
  import drawer from './layout/drawer.vue'
  import pkg from '../../package'
  import Vue from 'vue'
  import {
    mapGetters,
    mapMutations,
    mapState,
    mapActions
  } from 'vuex'
  import {
    Dialog
  } from 'quasar'
  export default {
    name: "index",
    data() {
      return {
        verson: pkg.version,
        isSetting:false,
        isFb: false,
        tktCut: filtersStorage('tktCut') || null,
        menus: [{
          title: '巡检',
          uri: '/ble'
        }, {
          title: '曲线',
          uri: '/device'
        }],
        items: [{
          title: '报障',
          uri: '/ticket',
          count:0
        }, {
          title: '抄表',
          disabled: true,
          uri: '/device'
        }, {
          title: '设备',
          uri: '/device'
        }, {
          title: '巡检',
          disabled: true,
          uri: '/device'
        }],
      }
    },
    computed: {
      leftDrawer() {
        // console.log(this.$children)
        return this.$children[3].$refs.leftDrawer
      },
      _modal() {
        let _pa = this.$route.query
      // console.log('---mm', _pa)
        return _pa
      },
    },
    watch: {
      '$route' (to, from) {
      //  console.log('[][', to, from)
        if (to.query._modal) {
          this[to.query._modal]()
        }
      }
    },
    mounted() {
      if (this.$route.query) {
        this.$router.push({
          path: '/index',
          query: {}
        })
      }
    },
    methods: {
      ...mapActions(['setError']),
      Setting(){
        this.$refs.layoutModal.open()
        this.isSetting=true
      },
      getFd() {
        this.isFb = true
        this.$refs.layoutModal.open()
      },
      notify() {
        this.isSetting = false
        this.isFb = false
        this.setError()
        this.$refs.layoutModal.close();
      },
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
    components: {
      setting,
      feedBack,
      drawer,
    },
  }

</script>
<style>
  .index-menu {
    padding-top:1rem;
    width: 80vw;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .index-page .banner {
    width: 100vw;
  }

  .tb-btn {
    z-index: 9;
    background: transparent;
  }

  .index-img {
    width: 100vw;
    position: relative;
    margin-top: -50px;
  }

  .bg-count {
    top: 0!important;
    width: 28px;
    height: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    justify-content: center;
    overflow: hidden;
    color: black;
    background: #FDB617!important;
    padding: .3rem!important;
  }

  .menu-row {
    align-items: center;
    padding: 30px 10px;
  }
.ftCon{
    padding: 5px 0;
    color: gray;
    font-size: 10px;
}
</style>
