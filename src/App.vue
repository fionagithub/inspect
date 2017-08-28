<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout>
    <toolbar slot="header" v-show="show.bar" :head-title="title" :search="search" :go-back='direction'></toolbar>
    <drawer v-show="show.drawer" ></drawer>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </q-layout>
  </div>
</template>

<script>
    import {
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
  import toolbar from 'components/layout/toolbar.vue'
  import drawer from 'components/layout/drawer.vue'
  export default { 
    computed:{
      ...mapState(['title','search','show', 'direction'])
    },
    components: {
      toolbar,
      drawer
    }

  }

</script>

<style></style>
