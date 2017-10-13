<template>
  <div class="index-page window-height window-width column items-center no-wrap">
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
  </div>
  <img class="index-img" src="../assets/bj_logo.png">
  <div class="index-menu  text-center">
    <div class="row content-center text-center menu-row">
      <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2<0">
        <router-link :to="item.uri">
          <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
            <span class="floating circular label bg-dark bg-count" v-if='item.count' >{{ item.count}} </span>
          </button>
        </router-link>
      </div>
    </div>
    <div class="row content-center text-center menu-row">
      <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2>=0">
        <router-link :to="item.uri">
          <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
        </router-link>
      </div>
    </div>

  </div>
  <div slot="footer">
    {{verson}}
  </div>
  <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
    <feed-back v-if='isEdit' />
  </q-modal>
  </div>
</template>

<script>
  import filtersStorage from './conf/storage'
  import 'src/assets/css/index.css'
  import feedBack from './Feedback/template'
  import Vue from 'vue'

  Vue.component('feedBack', feedBack);
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
        verson: '0.4.8 071012',
        isEdit: false,
        tktCut: filtersStorage('tktCut') || null,
        items: [{
          title: '报障',
          uri: '/ticket',
        }, {
          title: '故障',
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
        return this.$parent.$children[0].$refs.leftDrawer
      },
      _modal() {
        let _pa = this.$route.query
        console.log('---mm', _pa)
        return _pa
      }
    },
    watch: {
      '$route' (to, from) {
        console.log('[][', to, from)
        if (to.query._modal) {
          this[to.query._modal]()
        }
      }
    },
    created() {
      if (!this.tktCut) {
        this.getTktCunt()
      } else {
        this.setCut(this.tktCut)
      }
      if (this.$route.query) {
        this.$router.push({
          path: '/',
          query: {}
        })
      }
    },
    methods: {
      ...mapActions('tickets', {
        findTkt: 'find',
      }),
      ...mapActions(['setError']),
      getFd() {
        this.isEdit = true
        this.$refs.layoutModal.open()
      },
      setCut(ttl) {
        this.items.map(function (k, i) {
          if (k.uri.indexOf('/ticket') == 0) {
            k.count = ttl
          }
        })
      },
      notify() {
        this.isEdit = false
        this.setError()
        this.$refs.layoutModal.close();
      },
      getTktCunt() {
        let self = this
        this.findTkt({
          query: {
            $limit: 0,
            state: "0"
          }
        }).then(res => {
          console.log('--res---;', res)
          filtersStorage({
            value: res.total,
            key: 'tktCut'
          }, 'save')
          self.setCut(res.total)
        })
      },
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
  }

</script>
<style>
  .index-menu {
    padding: 3rem 2rem;
    width: 100vw;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .index-page .banner {
    width: 100vw;
  }

  .tb-btn {
    z-index: 9;
    color: white;
    background: transparent;
  }

  .index-img {
    margin-top: -50px;
    width: 100vw;
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

</style>
