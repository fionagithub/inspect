<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
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
