<template>
  <div>
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