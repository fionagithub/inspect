<template>
  <div> 
    <div class="layout-padding">
      <div class="card" v-for="items in message.data">
        <div class="card-title">
          {{items.deviceName}}
        </div>
        <img src="../img/water.jpg" alt="">
        <div class="card-content">
          <ol>
            <li v-for="mon in items.monitors">
              <span>  {{mon}}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import toolbar from 'components/layout/toolbar.vue'
  export default {
    name: "detail",
    components: {
      toolbar
    },
    created(){
      this.setBarInfo()
    },
    methods:{
      ...mapMutations(['setBar'] ),
      setBarInfo(){
        let obj={
          title:'报障清单',
          search:false,
          show: {
            bar:true,
            drawer:false,
          },
          direction:'true'
        }
        this.setBar(obj)
      },
    },
    computed: {
      ...mapGetters('message', {
        findMessages: 'find'
      }),
      message() {
        const id = this.$route.params.id
        return this.findMessages({
          query: {
            id: id
          }
        })
      }

    },
  }

</script>
<style>
  .layout-padding,
  .content {
    width: 100%;
    height: 100%;
  }

</style>
