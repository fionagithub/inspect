<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import { Platform,Toast } from 'quasar'
  export default{
    data(){
      return{
        platform: this.$q.platform.is
      }
    },
    created(){
      if(!this.platform.mobile){
        Toast.create({
          html: '建议使用移动端浏览页面',
          timeout: 5000
        })
        console.log(this.platform)
      }

    }
  }
</script>
<style></style>
