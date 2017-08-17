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
        <div class="card-title">
        </div>
        <div class="list item-inset-delimiter">
          <div class="item item-link" @click="getDetail(123)">
            <i class="item-primary">mail</i>
            <div class="item-content has-secondary">
              ahu
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

  export default {
    data() {
      return {
        searchModel:''
      }
    },
    components: {
      toolbar
    },
    methods: {
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
