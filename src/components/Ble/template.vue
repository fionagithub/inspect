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
              <q-toggle v-model="isBleToggled"></q-toggle>
            </div>
          </div>
        </div>
      <div class="card" v-if='closestBleDevice.name'>
        <div class="card-title">
          <div>{{closestBleDevice.name}} </div>

        </div>
        <div class="card-content">
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 湿度 </div>
            <div class="d-val " >
              {{closestBleDevice.data.humidity }}%
            </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 温度 </div>
            <div class="d-val ">
              {{ closestBleDevice.data.temperature }} ℃ 
              </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> RSSI </div>
            <div class="d-val " >
              {{closestBleDevice.rssi }}
            </div>
          </div>
          <div class="item d-info multiple-lines ">
            <div class="item-label d-label "> 更新时间 </div>
            <div class="d-val " >
                {{closestBleDevice.time|date('HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
        <p>
          <ol v-if='bleDeviceList.length' class="smart">
            <li v-for='o in bleDeviceList' :key='o.id'>
              <a class='text-green-8'>
                {{o.name+': '+o.data.temperature+'℃ '+o.data.humidity+'% ' +o.rssi}}  {{o.time|date('HH:mm:ss') }}
                </a>
            </li>
          </ol>
          <ol v-if='logStickBuff.length' class="stick">
            <div>扫描中...</div>
            <li v-for='bf in logStickBuff' :key="bf.id">
              <a class='text-yellow-8' >{{bf}} </a>
            </li>
          </ol>
        </p>
      </div>
    </div>
  </q-layout>
</template>

<script>
import JKBLE from "./ble"
import { mapGetters, mapMutations, mapState, mapActions } from "vuex"
import { Toast } from "quasar"
export default {
  data() {
    return {
      title: "巡检",
      bleDeviceList: [],
      logStickBuff: [],
      closestBleDevice:{},
      isBleToggled: true,
      bleDeviceStack:{},
      upLoadInterval: 5000,
      scanTimeOut: 30*60*1000,
    };
  },
  mounted() {
    this.bleScan()
  },
  watch:{
    isBleToggled(val,oldval){
      if (val==true) {
        this.bleScan();
      } else {
        this.stopScan();
      }
    }
  },
  methods: {
    bleScan() {
      let vm = this;
      vm.bleDeviceList = [];
      vm.closestBleDevice={};
      vm.logStickBuff = [];

      // 开始扫描了
      ble.startScanWithOptions(
        [],
        { reportDuplicates: true },
        function onScanSuccess(bleDevice) {

          let bleDeviceId = bleDevice.id;
          let bleDeviceName = bleDevice.name;


          if (bleDeviceName && /^SMARTAG/.test(bleDeviceName.toUpperCase())) {

            // 忽略 rssi 值为正数的情况，正常情况向 rssi 值只可能是负数
            if(bleDevice.rssi > 0) return;

            // 初始化蓝牙模块
            let jkble = new JKBLE({
              schemaType: "smartTag",
              schemaVersion: "v1"
            });

            // 解析 ble 数据包
            let analysisResultData = bleDevice.advertising && 
                                     bleDevice.advertising.kCBAdvDataManufacturerData && 
                                     jkble.analyze(bleDevice.advertising.kCBAdvDataManufacturerData);
            
            // 忽略 数据不正确的情况
            if(!analysisResultData || !analysisResultData.$verified) return;

            // 准备上传用的数据格式
            let currentBLeDevice = {
              phoneId: window.device.uuid,
              name: bleDeviceName,
              data: analysisResultData,
              rssi: bleDevice.rssi,
              time: Date.now()
            };

            // rssi 均值算法，在一个周期内扫描到的相加取平均值，目的是防止由于信号漂移带来的误差
            if(bleDeviceName in vm.bleDeviceStack ){
              let previousRssi = vm.bleDeviceStack[bleDeviceName].rssi;
              let currentRssi = currentBLeDevice.rssi;

              // TODO 算法还需进一步优化，例如使用『众数』或『中位数』，待验证
              currentBLeDevice.rssi = Math.round( (currentRssi + previousRssi) / 2 );
            }

            vm.bleDeviceStack[bleDeviceName] = currentBLeDevice;

            vm.bleDeviceList = Object.values(vm.bleDeviceStack);

            // 改成更新『距离最近』标签的值，放入 5 秒定时任务
            // vm.closestBleDevice = currentBLeDevice

          } else {
            // 调试信息输出，把不是 smartag 的蓝牙设备打印出来
            let logLimit = 2;
            vm.logStickBuff.push(bleDeviceName + ":" + bleDeviceId)
            if (vm.logStickBuff.length > logLimit){
              vm.logStickBuff.shift();
            } 
          }

        },
        function onScanFailed(reason) {
          Toast.create({
            html: reason,
            timeout: 3000
          });
          console.log("---startScan failed---", reason);
        }
      ); 

      vm.uploadTimerId = setInterval( () => {
      
        // 通过 rssi 值获取当前距离最近的的 ble 设备
        let bleDeviceList = Object.values(vm.bleDeviceStack);
        let tempBleDevice = bleDeviceList[0];
        for(let i = 1; i < bleDeviceList.length; i++){
          let _device = bleDeviceList[i];
          if(_device.rssi > tempBleDevice.rssi){
            tempBleDevice = _device;
          }
        }
        vm.closestBleDevice = tempBleDevice;


        // 上传数据
        vm.bleUpload();
      }, vm.upLoadInterval)
     
      // 在最长 30 分钟后停止扫描
      setTimeout(vm.stopScan, vm.scanTimeOut);
    },
    ...mapActions("smarttag", {
      createMessages: "create"
    }),
    goBack() {
      this.$router.go(-1);
    },
    bleUpload() {
      let vm = this;
      let bleList=Object.values(vm.bleDeviceStack)
      if (bleList.length) {
        console.log("--up--",vm.bleDeviceStack, bleList);
         vm.bleDeviceStack={} 
          vm.createMessages(bleList)
          .then(() => {
            console.log("---updata--ok-");
            Toast.create({
              html: 'BLE 数据上传成功',
              timeout: 3000
            });
          })
          .catch(err => {
            console.log("上传失败", err);
             Toast.create({
              html: 'BLE 数据上传失败',
              timeout: 3000
            });
          });
      }
    },
    stopScan() {
      let vm = this;
      console.log('----stop--')
      ble.stopScan(
        function() {
          console.log("======= BLE: stop Scan complete =======");
          Toast.create({
            html: '已经停止 BLE 扫描',
            timeout: 3000
          });
        },
        function() {
          console.log("====== BLE: Stop scan failed ======");
          Toast.create({
            html: '停止 BLE 扫描失败',
            timeout: 3000
          });
        }
      );
    },
  },
  beforeDestroy() {
    // 清理工作
    clearInterval(this.uploadTimerId);
    this.stopScan();
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