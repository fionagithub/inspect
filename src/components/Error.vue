<template>
  <div class="row justify-center error">
    <router-link to='/login' v-if='getLogUri'> {{getLogUri}} </router-link>
    <span v-else>  {{getErrTips}} </span>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['getLogUri', 'getErrTips']),
    },
  }

</script>
<style>
.error{
  margin: 5px;
}
</style>