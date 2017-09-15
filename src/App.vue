<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <transition name="fade" mode="out-in">
      <keep-alive include="list">>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <drawer></drawer>
  </div>
</template>

<script>
  import './assets/css/index.css'
  import drawer from 'components/layout/drawer.vue'
  export default {
    components: {
      drawer
    },

  }

</script>

<style></style>
