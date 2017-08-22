<template>
  <div>
    <toolbar head-title="detail" go-back='true'>
    </toolbar>
    <div class="layout-view">
    
      <div class="layout-padding">
        <span>
        {{messages}}
      </span>
     </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toolbar from 'components/layout/toolbar/toolbar.vue'
  export default {
    name: "detail",
    components: {
      toolbar
    }, 
    computed: {
      ...mapGetters('message', {
        messages: 'list'
      })
    },
      created() {
        this.findMessages({
          query: {
            $limit: 10,
            //  $select: ['userId' ]
          }
        })
      },
    methods: {
      ...mapActions('message', {
        findMessages: 'find'
      })
    }
  }

</script>
