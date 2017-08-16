<template>
  <div>
    <toolbar :style="headStyle"></toolbar>
    <drawer></drawer>
    <div class="index-card card">
      <div class="card-media">
        <img src="../assets/laputa.jpg">
      </div>
      <div class="card-content">
          <router-link :to="item.uri" v-for="item in items">
            <button class="teal circular">
            {{item.title}}
          </button>
          </router-link>
        </div> 
    </div>
  </div>
</template>

<script>
  import toolbar from 'components/layout/toolbar/toolbar.vue'
  import drawer from 'components/layout/drawer/drawer.vue'
  export default {
    data() {
      return {
        items: [{title:'alarm',uri:'/device'},{title:'device',uri:'/device'}],
        headStyle: {
          'background': 0,
          'z-index': 2

        }
      }
    },
    components: {
      toolbar,
      drawer
    }
  }

</script>

<style>
  .index-card {
    position: absolute;
    height: 100%;
    top: 0;
  }
  .index-card .card-content{
  display: flex;
  flex-wrap: wrap;
  padding-top:60px;
  justify-content: space-around;
  
}
</style>
