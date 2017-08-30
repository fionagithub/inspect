<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout>
    <toolbar slot="header" v-show="nav.show.bar" :head-title="nav.title" :search="nav.search" :go-back='nav.direction'></toolbar>
    <drawer v-show="nav.show.drawer" ></drawer>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </q-layout>
  </div>
</template>

<script>
    import {
    mapState,  
  } from 'vuex'
  import toolbar from 'components/layout/toolbar.vue'
  import drawer from 'components/layout/drawer.vue'
  export default { 
    computed:{ 
      ...mapState([ 'nav'])
    }, 
    components: {
      toolbar,
      drawer
    }

  }

</script>

<style></style>
