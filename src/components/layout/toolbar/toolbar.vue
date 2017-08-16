<template>
  <div class="toolbar" v-show="getLayoutNeeded" :class="headStyle">
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <i>arrow_back</i>
    </section>
    <button class="hide-on-drawer-visible" @click="leftDrawer.open()" v-else>
      <i>menu</i>
    </button>
    <q-toolbar-title :padding="1" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </q-toolbar-title>
    <button class="right-drawer-opener"><i>more_vert</i></button>
    <slot name='search'></slot>
    <slot name="tabs"></slot>
  </div>
</template>
<script type="text/javascript">
  import {
    mapGetters
  } from 'vuex'
  export default {
    name:"toolbar",
    computed: {
      ...mapGetters(['getLayoutNeeded']),
      leftDrawer() {
        return this.$parent.$children[1].$refs.leftDrawer
      }
    },
    props: ['headTitle','headStyle', 'goBack']
  }

</script>
<style scoped>
  .toolbar {
    min-height: 60px;
  }

  .right-itens a,
  .right-itens button {
    margin-right: 10px;
  }

</style>
