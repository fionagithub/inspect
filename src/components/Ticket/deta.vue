<template>
 <q-modal ref="layoutModal" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-layout>
        <div slot="header" class="toolbar">
          <button @click="$refs.layoutModal.close()">
            <i>keyboard_arrow_left</i>
          </button>
          <q-toolbar-title :padding="1">
            Header
          </q-toolbar-title>
        </div>

        <div slot="header" class="toolbar primary">
          <q-search class="primary"></q-search>
        </div>

        <div slot="footer" class="toolbar">
          <q-toolbar-title :padding="1">
            Footer
          </q-toolbar-title>
        </div>

        <div class="layout-view">
          <div class="layout-padding">
            <h1>Modal</h1>
            <button class="primary" @click="$refs.layoutModal.close()">Close</button>
            <p class="caption" v-for="n in 15">This is a Modal presenting a Layout.</p>
          </div>
        </div>
      </q-layout>
    </q-modal>
</template>

<script>
export default {
  name:'tdat',
  data () {
    return {
      test:2323

    }
  }
}
</script>

<style>
</style>
