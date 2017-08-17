<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="detail" go-back='true'>
    </toolbar>
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
    <div class="layout-padding">
      <!-- Targets -->
      <div ref="tab-1"> <span>i'm detail</span>...</div>
      <div ref="tab-2">.22..</div>
      <div ref="tab-3">.33..</div>

    </div>
  </div>
</template>

<script>
  import toolbar from 'components/layout/toolbar/toolbar.vue'
  export default {
    components: {
      toolbar
    }
  }

</script>

<style>


</style>
