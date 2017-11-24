<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="goback()">
          <i>arrow_back</i>
        </button>
      <q-toolbar-title :padding="1">
        {{title}}
      </q-toolbar-title>
    </div>
    <div class="layout-view">
      <div class="layout-padding ">
        <div class="list item-delimiter">
          <div class="item">
          <div class="item-content has-secondary">
           Ble
          </div>
          <div class="item-secondary">
            <q-toggle v-model="isBle"></q-toggle>
          </div>
          </div>
        </div>
      </div>
        <ble :toggle='isBle'></ble>

    </div>
  </q-layout>
</template>

<script>
import ble from './bles.vue'
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "new",
    components: {
ble,
    },
    data() {
      return {
        title:'设置',
        isBle: false,
      }
    },
    methods: {
      goback() {
        this.$router.go(-1)
      },
    },
    destroyed: function () {
     // console.log("已销毁");
    },
  }

</script>
<style>
  .add-btn {
    margin-top: 50px;
  }

  .new-desc {
    height: 80px;
  }

  .form-group__message {
    display: none;
    font-size: .95rem;
    color: #CC3333;
    margin-left: 10em;
    margin-bottom: 12px;
  }

  .form-group--error+.form-group__message {
    display: block;
    color: #CC3333;
  }

</style>
