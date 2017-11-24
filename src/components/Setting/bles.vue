<template>
  <li>
  {{toggle}}
  </li>
</template>

<script>
import initialBLE from './ble'
export default {
  props: ['toggle'],
  watch:{
      toggle(val, oldval){
          if(val){
          initialBLE()
          }
      },
          
  }
}
</script>