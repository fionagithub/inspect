<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="detail" go-back='true' :style="headStyle">
      <div slot="tabs" class="tabs-container">
        <q-tabs :refs="$refs" default-tab="tab-1">
          <q-tab name="tab-1" icon="message">
            Tab 1
          </q-tab>
          <q-tab name="tab-2" icon="fingerprint">
            Tab 2
          </q-tab>
          <q-tab name="tab-3" icon="alarm">
            Tab 3
          </q-tab>
        </q-tabs>
      </div>

    </toolbar>
    <div class="layout-padding">
        <!-- Targets -->
        <div ref="tab-1">   <span>i'm detail</span>...</div>
        <div ref="tab-2">.22..</div>
        <div ref="tab-3">.33..</div> 
   
    </div>
  </div>
</template>

<script>
  import toolbar from 'components/layout/toolbar/toolbar.vue'

  import {
    mapMutations
  } from 'vuex'
  export default {
    data(){
      return {
          headStyle: {
          'display': 'grid',
          'grid-template-columns': '20px auto 30px',
          'min-height': '100px'
        }
      }
    },
    created() {
      this.setLayoutNeeded(true)
    },
    components: {
      toolbar
    },
    methods: {
      ...mapMutations(['setLayoutNeeded'])
    }
  }

</script>

<style>

.tabs-container{
      grid-column-start: 1;
    grid-column-end: 4;
    -ms-grid-row: 3;
    grid-row-start: 3;
    grid-row-end: 4;
}

</style>
