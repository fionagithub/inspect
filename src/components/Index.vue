<template>
  <div class="index">
    <toolbar class="index-toolbar"></toolbar>
    <drawer></drawer>
    <div class="index-card card">
      <div class="card-media">
        <img src="../assets/laputa.jpg">
      </div>
      <div class="card-content">
          <div class="row gutter wrap justify-stretch content-center text-center">
        <div class="auto link-btn" v-for="item in items">
        <router-link :to="item.uri">
          <button class="teal circular big">
            {{item.title}}
          </button>
        </router-link>
        </div>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import toolbar from 'components/layout/toolbar.vue'
  import drawer from 'components/layout/drawer.vue'
  import 'src/assets/css/index.css'

  export default {
    data() {
      return {
        items: [{
          title:'报障' ,
          uri: '/device'
        }, {
          title:'故障' ,
          uri: '/device'
        },{
          title:'设备' ,
          uri: '/alarm'
        },{
          title: '巡检',
          uri: '/device'
        }]
      }
    },
    components: {
      toolbar,
      drawer
    }
  }

</script>
<style>
.link-btn{
  margin: 20px;
}
</style>
