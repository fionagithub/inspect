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
        <div class="layout-view patch-view">
            <div class="layout-padding chart-padding" v-if='echartCrt&&chartData.length'>
                <p class="monitor-title"> {{monitorData.name}} </p>
                <div class="monitor-meta" > 
                  <span class="meta-value" > {{monitorData.value}} <span class="meta-unit">  {{monitorData.unit}} </span> </span>
                  <div class="meta-time" > {{monitorData._updateTime|date('H:mm')}} </div>
                </div>
                <div class="row monitor-nav" >
                    <div v-for="(value, key, index) in echartCrt.monitors" :key="index" @click="getChart(key)" class="monitor-items column ">
                      <div class="monitor-item">
                        <div class="meta-value">{{value.value}}
                          <span class="meta-unit">  {{value.unit }} </span>
                        </div>
                        <div class="monitor-name">{{value.name}} </div>
                      </div>
                    </div>
                </div>
                <div class="patch">
                    <IEcharts :option="echartMonitorData" @ready="getEchartData"></IEcharts>
                </div>
            </div>
        </div>
    </q-layout>
</template>

<script type="text/babel">
  let mockData={
    values:[],
    z:{
      data:[]
    },
    x:{
      data:[]
    }
  };

  import IEcharts from 'vue-echarts-v3/src/full.vue'
  import formatUtil from 'echarts/lib/util/format'
  import dark from 'echarts/theme/dark'
  import moment from 'moment'
  import echarts from '../../config/echarts'
  import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  export default {
    name: 'view',
    data(){
      return{
        theme: 'dark',
      //  title: '历史曲线',
        echartMonitorData:{series:[]} ,
        monitorData:{},
        echartOpt:{
          title: {},
          grid:{
            top:40,
            left:40,
            bottom: 30,
            right: 20,
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback){
              let time= parseInt(params[0].name), 
              tipLabel= formatUtil.formatTime('hh:mm', time) +" : "+params[0].value
              return tipLabel;
            } 
          },
          xAxis: {
            type:'category',
            axisLabel:{
              formatter(value,index){
                  var date = moment(parseInt(value)).format('H:mm')
                  return date;
              }
            },
          },
          yAxis: {},
          series: []
        },
        echartConf:{
          'default' : { 
            name: 'Sales',
            type: 'line',
            smooth: true,
            data:[]
          }
        },
      }
    },
    filters:{
      filterClr(src){
          let colors={
              "°C":"temp-red",
              'ppm':"ppm-origin",
              '%':"pct-blue",  
              'mg/m3':"mg-green",    
              'ug/m3' :"m3-orange", 
              "dBm" :"dbm-gold",
          }
          return colors[src]

      }
    },
    computed:{
      ...mapGetters('devices', {
        echartCrt: 'current',
      }),
      ...mapGetters('history_chart', {
        chartData: 'list',
      }),
      title(){
        return this.echartCrt.name
      },
    },
    methods: {
      getEchartData(){ 
        let conf = this.echartConf, opt = this.echartOpt; 
        let monitorId =this.chartData[0].id;
        let monitor= this.echartCrt.monitors[monitorId];
        this.monitorData=Object.assign({}, this.monitorData, monitor);
        let chart = echarts.xparse(opt, this.chartData[0], conf)
        this.echartMonitorData = Object.assign({}, this.echartMonitorData, chart)
      },
      getChart(id){
        //重新请求图表数据 
        const that =this
        let conf = that.echartConf, opt = that.echartOpt; 
        let monitor= this.echartCrt.monitors[id];
        this.monitorData=Object.assign({}, this.monitorData, monitor);
        that.find({
          query: {
            deviceId: that.echartCrt.id ,
              monitorId: id,
              gap:that.envChartGap
            }
          }).then(data =>{ 
            let  chart = echarts.xparse(opt, data[0], conf) 
               // !!!! vue 对象更改检测注意事项
              //   https://cn.vuejs.org/v2/guide/list.html#对象更改检测注意事项
              that.echartMonitorData = Object.assign({}, that.echartMonitorData, chart)
            }) 
      },
      ...mapActions('history_chart', {
        find: 'find',
      }),
      ...mapMutations('history_chart', {
        clearChartList: 'clearAll',
      }),
    },
    components: {
      IEcharts
    },
    destroyed(){
      //清空图表接口返回List数据
      this.clearChartList()
    }
  }
</script>
<style scoped>
  .patch-view {
    background: #f9f9f9;
  }
  .monitor-meta{
    display: block;
    color: #3ca59a;
    text-align: center;
  }
  .monitor-meta .meta-value{
    font-size: 3rem;
  }
  .monitor-meta .meta-unit{
    font-size: 1.5rem;
    color: #3ca59a;
    
  }
  .monitor-meta .meta-time{
    font-size: 6px;
    margin: 10px;
    text-align: right;
  }
  .monitor-title {
    font-size: 1.2rem;
    margin: 1.5rem .5rem;
  }

  .chart-padding {
    margin: 0 10px;
    padding: 0;
  }

  .patch {
   /* padding: 20px;*/
    height: 350px;
    overflow: hidden;
    margin-bottom: -1px;
    border-radius: 4px 4px 0 0;
    display: block;
  }

  .monitor-items {
    padding: 5px;
    color:#f58099;
    font-size: 8px;
    background: #f9f9e970;
    border: 2px solid #61626366;
    border-radius: 4px 4px 0 0;
    margin: 5px;
  }
  .monitor-items  .meta-unit{
    color:#f58099;
  }

  .monitor-nav {
    border: 1px solid #eaeaea;
    padding: 10px 0;
    color: white;
    overflow: auto;
    margin: 0 -10px;
  }

  .monitor-item{
    padding: 20px 0;
    width: 100px;
    text-align: center;
  }
  .monitor-item .meta-value{
    font-size: 1rem;
    margin: 3px;
  }
  .dbm-gold {
    background: #efeaaa;
  }

  .echarts {
    padding: 10px;
    width: 100vw;
    height: 30vh;
  }
</style>