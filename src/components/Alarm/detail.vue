<template>
  <!-- root node required default-tab="1" -->
  <div>
    <toolbar :head-title="items.deviceName" go-back='true'>
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
      <div ref="tab-1">
        <div v-for="(item, key, index)  in items.monitors">
          {{item.monitorType.description}} {{item.status.statusValue }}
        </div>
      </div>
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
    },
    mounted() {
      this.$nextTick(() => {
        this.getDetail()
      })
    },
    methods: {
      getDetail() {
        const id = this.$route.params.id
        console.log('--detail--', id)
        this.uri += id
        fetch(this.uri).then(res => {
          if (res.ok) {
            res.json().then(data => {
              this.items = data.devices[0]
              console.log('----', this.items)
            })
          } else {
            this.items = []
            console.log("Looks like the response wasn't perfect, got status", res.status);
          }
        }).then(data => {
          this.items = []
          console.error(data)
        })
      }

    },
    data() {
      return {
        uri: 'http://192.168.123.125:3030/message/',
        items: {},
      }
    }
  }

</script>
