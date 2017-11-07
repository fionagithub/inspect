<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
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
            <li>
            {{log}}
            </li>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
import BLE from './ble'
export default {
  data(){
    return{
     title:"巡检",
     log:{},      
    isBle: false,
    }
  },
  watch:{
      isBle(val, oldval){
        if(val){
         this.log= BLE.initialBLE()
        }else{
        this.log=  BLE.stopScan()
        }
      },
          
  }
}
</script>