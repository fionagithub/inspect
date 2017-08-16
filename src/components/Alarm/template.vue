<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="alarm" go-back='true' :style="headStyle">
      <div slot="search" class="device-search">
        <q-search v-model="searchModel"></q-search>
      </div>
    </toolbar>
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
        searchModel:'',
        headStyle: {
          'display': 'grid',
          'grid-template-columns': '20px auto 30px',
          'min-height': '100px'
        }
      }
    },
    components: {
      toolbar
    },
    methods: {
      getDetail(id) {
        this.$router.push({
          path: '/alarm/' + id
        })
      }
    }
  }

</script>
<style>
  .device-search {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 3;
    grid-row-end: 4;
  }

</style>
