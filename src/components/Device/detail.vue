<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button>
      <q-toolbar-title :padding="1">
        设备详情
      </q-toolbar-title>
    </div>
    <q-tabs slot="navigation" :refs="$refs" v-model="tabNo">
      <q-tab name="tab-1">概览
      </q-tab>
    </q-tabs>
    <div class="layout-view">
      <div class="layout-padding" v-if="echartCrt">
        <div class="card" ref="tab-1">
            <div class="card-media">
              <img src="../../assets/img/building.jpg">
              <button class="green circular d-status"><i>check</i></button>
            </div>
            <div class="card-title d-title">
              <div>{{echartCrt.name}} </div>
            </div>
            <div class="card-content list no-border highlight">
              <div class="item multiple-lines d-lines ">
                <div class="item-content row items-center">
                  <div class="item-label dd-label">安装位置</div>
                  <div class="item-title dd-title">
                    {{echartCrt.location.building+"|"+echartCrt.location.floor+"|"+echartCrt.location.room}}

                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">当前状态</div>
                  <div class="item-title dd-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">更新时间</div>
                  <div class="item-title dd-title">
                    {{echartCrt._modifyTime |date('HH:mm:ss') }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">维修记录</div>
                  <a class="item-title dd-title" >

                    {{'8次' }}</a>
                </div>
              </div>
            </div>
            <div class="card-actions card-no-top-padding">
              <div class="text-line" v-for='(item,_index) in echartCrt.tags' :key="_index" >
                {{item}}
              </div>
            </div>
            <div class="go-ticket card-actions card-no-top-padding" >
              <button class="primary clear small" @click='goTicket()' ><i class="on-left">directions</i> 我要报障</button>
            </div>
          </div>
          <div class="chart-padding">
            <div v-for="(value, key, index) in echartCrt.monitors" :key="index" @click="getChart(key)" class="patch">
              <div class="monitor-name">{{value.name}} </div>
              <div class="monitor-item">
                <div class="meta-value">{{value.value}} <span class="meta-unit">     {{value.unit }} </span> </div>
              </div>
            </div>  
          </div>
      </div>

       <div class="row justify-center" style="margin-bottom: 50px;">
        <err v-if="getGlbErr.isFlag"/>
      </div>
    </div>
     <q-modal ref="chartModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <echart v-if='echartFlag' />
    </q-modal>
  </q-layout>
</template>

<script>
  import echart from './echart'
  import popover from '../layout/popover'
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "detail",
    data() {
      return {
          envChartGap:10,
         tabNo:'tab-1',
        echartFlag:false,
      }
    },
    computed: {
     ...mapGetters(['getGlbErr']),
      ...mapGetters('devices', {
        echartCrt: 'current',
      }),
    },
    components: {
      popover
    },
    created() {},
    mounted() {
    },
    methods: {
      ...mapMutations('devices', {
        clear: 'clearCurrent'
      }),
      ...mapActions('devices', {
        findMessages: 'get',
      }),
      notify() {
        this.echartFlag = false
        this.$refs.chartModal.close();
      },
      getChart(id) {
        this.echartFlag = true
        this.find({
          query: {
            deviceId: this.echartCrt.id ,
              monitorId: id,
              $$start:Date.now() - 3600000,
             // gap:this.envChartGap
            }
          })
        this.$refs.chartModal.open()
      },
      //only find
      ...mapActions('environment_chart', {
        find: 'find',
      }),
    },
    components: {
      echart
    },
    destroyed: function () {
      this.clear() // 置空ticket-vuex      
    //  console.log("已销毁");
    },
  }

</script>
<style>
  .d-status {
    left: 28px;
    right: 0;
  }

  .d-title {
    margin-top: 50px;
    padding: 0 15px;
  }
.d-lines{
  width: 100%;
}
 .dd-label{
  flex: 1;
}
.dd-title{
  flex:2;
  font-size: 16px;
  font-weight: 400;
}
.card-actions{
  flex-wrap: wrap;
  padding: 12px;
  justify-content: flex-start;
}
.go-ticket{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}



  .chart-padding {
    margin: 0 10px;
    padding: 0;
  }

  .patch {
    display: flex;
    background-color: #fff;
    border: 1px solid #eaeaea;
    padding: 12px 16px;
    overflow: hidden;
    margin-bottom: -1px;
    border-radius: 4px 4px 0 0;
  }

  .monitor-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .monitor-name {
    padding: 10px 0;
    font-size: 20px;
    flex: 1;
  }
 .meta-value{
    font-size: 28px;
  }
  .meta-unit{
    font-size: 18px;
    color: #4c4c4c;
  }
  .echarts {
    padding: 10px;
    width: 100vw;
    height: 30vh;
  }
</style>
