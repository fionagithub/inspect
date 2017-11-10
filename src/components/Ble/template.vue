<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="goBack()">
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
      <div class="card" v-if='crt_log.name'>
        <div class="card-title">
          <div>{{crt_log.name}} </div>

        </div>
        <div class="card-content">
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 湿度 </div>
            <div class="d-val " >
              {{crt_log.data.humidity }}%
            </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 温度 </div>
            <div class="d-val ">
              {{ crt_log.data.temperature }} ℃ 
              </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> RSSI </div>
            <div class="d-val " >
              {{crt_log.rssi }}
            </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 更新时间 </div>
            <div class="d-val " >
                {{crt_log.time|date('HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
        <p>
          <ol v-if='smartLog.length' class="smart text-green-8">
            <li v-for='o in smartLog'>
              <a class='text-green-8'>
                {{o.name+': '+o.data.temperature+'℃ '+o.data.humidity+'% ' +o.rssi}}  {{o.time|date('HH:mm:ss') }}
<!-- 
                              {{`${o.name} ${o.data.temperature} '℃' ${o.data.humidity} '%' ${ o.time|date('HH:mm:ss')}  `}}
                 -->
                </a>
            </li>
          </ol>
          <ol v-if='logStickBuff.length' class="stick text-yellow-8">
            <div>扫描中...</div>
            <li v-for='bf in logStickBuff'>
              <a class='text-yellow-8' >{{bf}} </a>
            </li>
          </ol>
        </p>
      </div>
    </div>
  </q-layout>
</template>

<script>
import moment from 'moment'
import JKBLE from "./ble"
import cloneDeep from 'lodash.clonedeep'

// console.log("---jkble---", JKBLE);
import { mapGetters, mapMutations, mapState, mapActions } from "vuex"
import { Toast } from "quasar"
export default {
  data() {
    return {
      title: "巡检",
      smartLog: [],
      logStickBuff: [],
      s_log: {},
      s_buff: {},
      crt_log:{},
      bleFlag: false,
      isBle: true,
      u_array:[],
      t_obj:{},
    };
  },
  mounted() {
    this.bleScan()
    
   //  this.back_upload()
  },
  computed: {
    toggleBtn() {
      return this.bleFlag;
    },
    len() {
      return this.u_array.length;
    }
  },
  watch:{
    isBle(val,oldval){
      if (val==true) {
        this.bleScan();
      } else {
        this.stopScan();
      }
      console.log('--vv--', val, oldval)
    }
  },
  methods: {
    bleScan() {
      let vm = this;
      console.log('---start===')
      vm.smartLog = [];
      // vm.s_log={};
      vm.crt_log={};
      vm.logStickBuff = [];
      ble.startScanWithOptions([],{ reportDuplicates: true },function(_data_) {
        //   console.log('-----start----', _data_)
          let _id = _data_.id,
            _name = _data_.name;
          if (_name) {
            if (/^SMARTAG/.test(_name.toUpperCase())) {
              let jkble = new JKBLE({
                schemaType: "smartTag",
                schemaVersion: "v1"
              });
              // analyze
              let mdata = _data_.advertising && _data_.advertising.kCBAdvDataManufacturerData && jkble.analyze(_data_.advertising.kCBAdvDataManufacturerData);
              let __dess__ = {
                phoneId: device.uuid,
                name: _name,
                data: mdata,
                rssi: _data_.rssi,
                time:Date.now(),
              };
              if(_name in vm.t_obj ){
                if(__dess__.rssi > vm.t_obj[_name].rssi && __dess__.rssi < 0 ){
                  vm.t_obj[_name]=__dess__
                  console.log('----rrsssiii----',__dess__.rssi , vm.t_obj[_name].rssi )
                }
              }else{
                  vm.t_obj[_name]=__dess__
              }
            //  vm.s_log[_name]=__dess__
              vm.smartLog=Object.values(vm.t_obj)
              
            //  vm.smartLog.push(vm.t_obj)
              vm.crt_log=__dess__

              console.log("---buff---", vm.t_obj, vm.t_obj[_name],__dess__, vm.smartLog);

            } else {
              let _sdvc = _name + ":" + _id;
              vm.logStickBuff.push(_sdvc)
              if (vm.logStickBuff.length > 2) vm.logStickBuff.shift();
            }
          }
        },
        function(reason) {
          Toast.create({
            html: reason,
            timeout: 3000
          });
          console.log("---startScan failed---", reason);
        }
      ); 

     window.itvalFunc = setInterval(this.back_upload,5000)
     
      setTimeout(vm.stopScan, 30 * 1000 *60);
    },
    ...mapActions("smarttag", {
      createMessages: "create"
    }),
    goBack() {
      this.$router.go(-1);
    },
    back_upload() {
      let vm = this;
      let t_array=Object.values(vm.t_obj)
   //   let _data = t_array.length ? t_array.splice(0, 20) : null;
      if (t_array.length) {
        console.log("--up--",vm.t_obj, t_array);
         vm.t_obj={} 
         vm.s_log={}
          vm.createMessages(t_array)
          .then(() => {
            console.log("---updata--ok-");
          })
          .catch(err => {
            console.log("上传失败", err);
          });
      }
    },
    stopScan() {
      let vm = this;
      console.log('----stop--')
      ble.stopScan(
        function() {
          console.log("======= BLE: stop Scan complete =======");
   
        },
        function() {
          console.log("====== BLE: Stop scan failed ======");
        }
      );
    },
    checkBle() {
      let vm = this;
      console.log("Bluetooth ----is checking");
      ble.startStateNotifications(function(state) {
        console.log("Bluetooth is ====" + state);
        if (state == "on") {
          vm.bleFlag = false;
          console.log("-ok--", vm.bleFlag);
        } else {
          Toast.create({
            html: "未能成功地打开蓝牙,请手动开启",
            timeout: 3000
          });
          vm.bleFlag = true;
          console.log("-err--", vm.bleFlag);
        }
      });
    },
  },
  beforeDestroy() {
   // this.back_upload();
     clearInterval(window.itvalFunc)
    this.stopScan();
    // updata splice array
  }
};
</script>

<style>
.log {
  position: relative;
  top: 180px;
}

.smart {
  height: 140px;
  margin: 5px 0;
  overflow: auto;
}

.stick {
  font-size: 12px;
  line-height: 14px;
  position: absolute;
  height: 90px;
  bottom: 0;
}
.d-info{
  display: flex;
  padding: 8px;
}
 .d-label{
   flex: 1;
 }
 .d-val{
   flex: 2;
 }
</style>