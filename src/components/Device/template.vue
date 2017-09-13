<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="报警" go-back='true'>
    </toolbar>
    <div slot="search" class="toolbar">
      <q-search :model.sync="searchModel"></q-search>
    </div>
    <!-- your content -->
    <div class="layout-padding">
      <div class="card">
        <div class="card-title">
        </div>
        <div class="list item-inset-delimiter">
          <div class="item item-link" v-for="(item, index) in items" @click="getDetail(item.deviceId)">
            <i class="item-primary">mail</i>
            <div class="item-content has-secondary device-desc ">
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
  import toolbar from 'components/layout/toolbar.vue'

  export default {
    data() {
      return {
        uri: 'http://192.168.123.125:3030/message',
        searchModel: '',
        items: []
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getApi()
      })
    },
    components: {
      toolbar
    },
    methods: {
      getDetail(id) {
        this.$router.push({
          path: '/alarm/' + id
        })
      },
      getApi() {
        let uri = this.uri
        fetch(uri).then(res => {
          if (res.ok) {
            res.json().then(data => {
              this.items = data.data[0].devices
              console.log('----', this.items)
            })
          } else {
            this.items = []
            console.log("Looks like the response wasn't perfect, got status", res.status);
          }
        })
      }
    }
  }

</script>
<style>
  .card  .device-desc{
    padding: 10px 0;
  }

</style>
