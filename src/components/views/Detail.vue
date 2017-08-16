<template>
  <!-- root node required -->
  <div>
    <toolbar head-title="detail" go-back='true' >
    </toolbar>
    <div class="layout-padding">
      <span>i'm detail</span>
    </div>
  </div>
</template>

<script>
    import toolbar from 'components/layout/toolbar/toolbar.vue'

import { mapMutations} from 'vuex' 
export default {
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
</style>
