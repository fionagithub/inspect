<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <transition name="fade" mode="out-in">
      <keep-alive include="ticket">>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <drawer></drawer>
  </div>
</template>

<script>
  import drawer from 'components/layout/drawer.vue'

  export default {
    components: {
      drawer
    },

  }

</script>

<style></style>
