<template>
  <div>
    <div class="toolbar">
      <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
        <i>arrow_back</i>
      </section>
      <button class="hide-on-drawer-visible" @click="leftDrawer.open()" v-else>
      <i>menu</i>
    </button>

      <q-toolbar-title :padding="1" v-if="headTitle">
        <span class="title_text">{{headTitle}}</span>
      </q-toolbar-title>

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
  <div class="toolbar" v-if="search">
    <q-search v-model="searchModel" @enter='getMessages()'></q-search>
  </div>
  </div>
</template>
<script type="text/javascript">
  import {
    Dialog
  } from 'quasar'
  export default {
    name: "toolbar",
    data() {
      return {
        searchModel: '',
      }
    },
    computed: {
      leftDrawer() {
        return this.$parent.$children[1].$refs.leftDrawer
      }
    },
    mounted() {
    },
    methods: {
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      }, 
    },
    props: ['headTitle', 'goBack', 'search']
  }

</script>
<style scoped>
  .right-itens a,
  .right-itens button {
    margin-right: 10px;
  }

  .tran-bar {
    background: transparent;
  }

</style>
