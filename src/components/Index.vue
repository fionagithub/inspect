<template>
  <div class="layout-view index">
    <div class="toolbar">
      <button class="hide-on-drawer-visible" @click="leftDrawer.open()">
      <i>menu</i>
    </button>
      <button class="right-drawer-opener"><i>more_vert</i>
          <q-popover ref="popover" anchor="top left" self="bottom left" class="bg-white text-black">
            <div class="list highlight ">
              <div class="item">
                <button class="defalut" @click="alert()">首页管理 </button>
    </div>
  </div>
  </q-popover>
  </button>
  </div>


  <div class="index-card card">
    <div class="card-media">
      <img src="../assets/laputa.jpg">
    </div>
    <div class="card-content">
      <div class="row large-gutter">
        <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2<0" >
          <router-link :to="item.uri">
            <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
          </router-link>
        </div>
      </div>
      <div class="row large-gutter">
        <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2>=0" >
          <router-link :to="item.uri">
            <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
  import 'src/assets/css/index.css'
  import {
    Dialog
  } from 'quasar'
  import {
    mapMutations
  } from 'vuex'
  export default {
    name: "index",
    data() {
      return {
        items: [{
          title: '报障',
          uri: '/device'
        }, {
          title: '故障',
          disabled: true,
          uri: '/device'
        }, {
          title: '设备',
          disabled: true,
          uri: '/alarm'
        }, {
          title: '巡检',
          disabled: true,
          uri: '/device'
        }]
      }
    },
    computed: {
      leftDrawer() {
        return this.$parent.$children[1].$refs.leftDrawer
      }
    },
    created() {
      this.setNavInfo()
    },
    methods: {
      ...mapMutations(['setNav']),
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
      setNavInfo() {
        let obj = {
          show: {
            drawer: true,
          }
        }
        this.setNav(obj)
      },
    },
  }

</script>
<style>
  .link-btn {
    margin: 20px;
  }

  .index .toolbar {
    color: white;
    z-index: 9;
    background: transparent;
  }

</style>
