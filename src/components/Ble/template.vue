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
              {{ crt_log.data.temperature }}C
              </div>
          </div>
          <div class="item d-info multiple-lines ">
            {{crt_log.time}}
          </div>
        </div>
      </div>
        <p>
          <ol v-if='smartLog.length' class="smart text-green-8">
            <li v-for='log in smartLog'>
              <a class='text-green-8' v-for='o in log'>{{o.name+': t:'+o.data.temperature+' h:'+o.data.humidity+o.time }} </a>
            </li>
          </ol>
          <ol v-if='logStickBuff.length' class="stick text-yellow-8">
            <div>扫描中...</div>
            <li v-for='buff in logStickBuff'>
              <a class='text-yellow-8' v-for='bf in buff'>{{bf}} </a>
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
      isBle: false,
      u_array:[]
    };
  },
  mounted() {
    // this.back_upload()
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
      ble.startScan([],function(device) {
           console.log('-----start----', device)
          let _id = device.id,
            _name = device.name;
          if (_name) {
            if (/^SMARTAG/.test(_name.toUpperCase())) {
              let jkble = new JKBLE({
                schemaType: "smartTag",
                schemaVersion: "v1"
              });
              // analyze
              let mdata = device.advertising && device.advertising.kCBAdvDataManufacturerData && jkble.analyze(device.advertising.kCBAdvDataManufacturerData);
              let _device = {
                //  phoneId: window.device.uuid,
                phoneId: _id,
                name: _name,
                data: mdata,
                rssi: device.rssi,
                time: new Date()
              };
              vm.crt_log=_device
              //need foreach
                let ss_dd=cloneDeep(_device)
                ss_dd.time=Date.now()
                vm.u_array.push(ss_dd)
              if (_name in vm.s_log) {
                vm.smartLog[_id] = ss_dd;
              } else {
                let _dvc = {};
                _dvc[_id] = ss_dd;
                console.log('--dv--', _dvc)
                vm.smartLog.push(_dvc);
                vm.s_log[_name] = {};
              }
            } else {
              let _sdvc = _name + ":" + _id;
              //need foreach
              if (_name in vm.s_buff) {
                vm.logStickBuff[_id] = _sdvc;
              } else {
                let _skf = {};
                _skf[_id] = _sdvc;
                vm.logStickBuff.push(_skf);
                vm.s_buff[_name] = {};
              }
              if (vm.logStickBuff.length > 3) vm.logStickBuff.shift();
            }
          }
          setInterval(vm.back_upload,5000)
            console.log( "---buff---", vm.s_log, vm.smartLog, vm.s_buff, vm.logStickBuff );
        },
        function(reason) {
          console.log("---startScan failed---", reason);
        }
      ); 
     
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
      /* let _data = [{
                //  phoneId: window.device.uuid,
                phoneId: '123',
                name: 'test',
                data: [],
                rssi: 123,
                time: Date.now()
              }]; */
      let _data = vm.len ? vm.u_array.splice(0, 20) : null;
      if (_data) {
        console.log("--up--", _data);
          vm.createMessages(_data)
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
          vm.smartLog = [];
          vm.logStickBuff = [];
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
  height: 200px;
  margin: 10px 0;
  overflow: auto;
}

.stick {
  font-size: 12px;
  line-height: 14px;
  position: absolute;
  bottom: 0;
}
.d-info{
  display: flex;
}
 .d-label{
   flex: 1;
 }
 .d-val{
   flex: 2;
 }
</style>