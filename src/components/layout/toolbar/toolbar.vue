<template>
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
        <div class="list highlight " >
          <div class="item">
            <div class="item-content">Layout</div>
          </div> 
        </div>
      </q-popover></button>
       
  </div>
</template>
<script type="text/javascript">
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: "toolbar",
    data() {
      return {
        userInfo: ''

      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getUser()
      })
    },
    methods: {
      getUser() {
        //  this.getUserInfo()
        this.userInfo = this.getUserInfo
        console.log('-=-', this.getUserInfo)
        if (this.userInfo == '') {
          this.$router.push({
            path: '/login'
          })
        }
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo'
      ]),
      leftDrawer() {
        return this.$parent.$children[1].$refs.leftDrawer
      }
    },
    props: ['headTitle', 'goBack']
  }

</script>
<style scoped>
  .right-itens a,
  .right-itens button {
    margin-right: 10px;
  }

</style>
