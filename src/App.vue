<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout>
      <div class="layout-view">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </q-layout>
  </div>
</template>

<script>
  export default { 
  
  }

</script>

<style></style>
