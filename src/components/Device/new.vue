<template>
  <div>
    <toolbar head-title="new" go-back='true'>
    </toolbar>
    <div class="layout-view">

      <div class="layout-padding">
        <span>
            new
      </span>
      </div>
    </div>
  </div>
</template>

<script>
  import toolbar from 'components/layout/toolbar.vue'
  export default {
    name: "detail",
    components: {
      toolbar
    } 
  }

</script>
