<template>
  <div class="index">
    <toolbar class="index-toolbar"></toolbar>
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
  import 'src/assets/css/index.css'

  export default {
    data() {
      return {
        items: [{
          title: 'alarm',
          uri: '/alarm'
        }, {
          title: 'device',
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
