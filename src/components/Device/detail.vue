<template>
  <div>
    <toolbar head-title="detail" go-back='true'>
    </toolbar>
    <div class="layout-view">

      <div class="layout-padding">
        <span>
        {{filtersMessage.deviceId}}
        {{filtersMessage.deviceName}}
        {{filtersMessage.deviceNo}}
      </span>
        <ol>
          <li v-for="(item,i,g) in filtersMessage.monitors">
            {{item}}

          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  import toolbar from 'components/layout/toolbar/toolbar.vue'
  export default {
    name: "detail",
    components: {
      toolbar
    },
    computed: {
      ...mapGetters('message', {
        messages: 'list'
      }),
      filtersMessage() {
        return this.messages[0].devices[0]
      }
    },
    created() {
      const id = this.$route.params.id
      this.findMessages({
        query: {
          id: id
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
