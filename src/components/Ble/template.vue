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
            <div class="item-secondary" v-if='toggleBtn==false' >
              <q-toggle @input='toggleBle()' v-model="isBle"></q-toggle>
            </div>
          </div>
        </div>
        <p>
          <ol v-if='smartLog.length' class="smart text-green-8">
            <li v-for='log in smartLog'>
              <a class='text-green-8' v-for='o in log' >{{o.name+':'+o.phoneId}} </a>
            </li>
          </ol>
          <ol v-if='logStickBuff.length' class="stick text-yellow-8">
            <div>扫描中...</div>
            <li v-for='buff in logStickBuff'>
              <a class='text-yellow-8' v-for='bf in buff' >{{bf}} </a>
            </li>
          </ol>
        </p>
      </div>
    </div>
  </q-layout>
</template>

<script>


  import {
    Toast
  } from 'quasar'
  export default {
    data() {
      return {
        title: "巡检",
        smartLog: [],
        logStickBuff: [],
        bleFlag: true,
        isBle: false,
      }
    },
    mounted() {
       this.checkBle()
    },
    computed:{
      toggleBtn(){
        return this.bleFlag
      }
    },
    methods: {
      checkBle() {
        let vm = this
        console.log("Bluetooth ----is checking");
        ble.startStateNotifications(
          function(state) {
            console.log("Bluetooth is ====" + state);
            if (state=='on') {
              vm.bleFlag = false
              console.log('-ok--',vm.bleFlag)
            } else {
              Toast.create({
                html: '未能成功地打开蓝牙,请手动开启',
                timeout: 3000
              })　　　　
              vm.bleFlag = true
              console.log('-err--',vm.bleFlag)
            }
          }
        );
      },
      toggleBle(){
          if(this.isBle){
            this.bleScan()
          }else{
            this.stopScan()
          }
      },
      bleScan() {
        let vm = this
        ble.startScan([],
          function(device) {
            let _id = device.id,_name=device.name
            if(_name){
              if (/^SMARTTAG/.test(_name.toUpperCase())) {
                let mdata = device.advertising && device.advertising.kCBAdvDataManufacturerData && new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
                let _device = {
                  //  phoneId: window.device.uuid,
                  phoneId: _id,
                  name: _name,
                  data: mdata.join(','),
                  rssi: device.rssi,
                  time: new Date()
                }
                if (_id in vm.smartLog) {
                  vm.smartLog[_id] = _device
                } else {
                  let _dvc={}
                  _dvc[_id]=_device
                  vm.smartLog.push(_dvc)
                }
                console.log('---upload---', vm.smartLog)
                // upload(_device);
              } else {
                let _device = _name + ':' + _id
                if (_id in vm.logStickBuff) {
                  vm.logStickBuff[_id] = _device
                } else {
                  let _skf={}
                  _skf[_id]=_device
                  vm.logStickBuff.push(_skf)
                }
                if (vm.logStickBuff.length > 3) vm.logStickBuff.shift();
              }
            }
          },
          function(reason) {
            console.log("---startScan failed---", reason);
          })
      },
      stopScan() {
        let vm = this
        ble.stopScan(
          function() {
            console.log("======= BLE: stop Scan complete =======");
            vm.smartLog = [];
            vm.logStickBuff = [];
          },
          function() {
            console.log("====== BLE: Stop scan failed ======");
          }
        );
      },
      handleLog(obj) {},
    }
  }
</script>

<style>
.log{
  position:relative;
  top:180px;
}
  .smart {
    height: 200px;
    margin:10px 0;
    overflow: auto;
  }
  .stick{
    font-size:12px;
    line-height:14px;
    position:absolute;
    bottom:0;
  }
</style>