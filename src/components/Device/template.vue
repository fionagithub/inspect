<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="设备" go-back='true'>
    </toolbar>
    <div slot="search" class="toolbar">
      <q-search :model.sync="searchModel"></q-search>
    </div>
    <!-- your content -->
    <div class="layout-padding">
      <div class="card">
        <div class="list item-inset-delimiter" v-for="item in device.devices " >
          <div class="item item-link" @click="getDetail(item.deviceId)">
            <i class="item-primary">mail</i>
            <div class="item-content has-secondary">
                {{item.deviceName}}
            </div>
            <i class="item-secondary">keyboard_arrow_right</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import toolbar from 'components/layout/toolbar/toolbar.vue'
import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        searchModel:''
      }
    },
    computed: {
      ...mapGetters('message', {
        messages: 'list'
      }),
      device(){
        console.log('=-=',  this.messages )
          return this.messages[0]
      }
    },
    components: {
      toolbar
    },
    created() {
      this.findMessages({
        query: {
          $limit: 10,
        }
      })
    },
    methods: {
      ...mapActions('message', {
        findMessages: 'find'
      }),
      getDetail(id) {
        this.$router.push({
          path: '/device/' + id
        })
      }
    }
  }

</script>
<style>

</style>
