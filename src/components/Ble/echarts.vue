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
      <div class="layout-padding chart-padding" v-if='echartCrt' >
        <p class="caption monitor-title"> {{echartCrt.name}} </p>
        <div class="echarts" v-for='(value, id, index) in echartMonitorData' :key="index" @click="resetEchartData(id)">
            <IEcharts :option="value.chart" :loading="value.loading" @ready="getEchartData(id)"></IEcharts>  
          <!--     
        <IEcharts :option="bar2" :theme="theme"></IEcharts>-->
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
        title: '历史曲线',
        envChartGap:10,
        echartMonitorData:{}, 
        echartOpt:{
          title: {},
          grid:{
            top:40,
            left:40,
            bottom: 30,
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
    computed:{
      ...mapGetters('devices', {
        echartCrt: 'current',
      }),
    },
    mounted(){
    },
    watch:{
      echartCrt(val, oldVal){
        if(typeof val=='object'){
          for(let i in val.monitors){ 
             this.echartMonitorData[i]={'loading':true,'chart': {series:[]} } 
          }
        }
      }
    },
    methods: {
      getEchartData(monitorId ){ 
        const that = this
        let conf = that.echartConf, opt = that.echartOpt; 
        let monitor= that.echartCrt.monitors[monitorId]
        let monitorTitle=monitor.name+`(${monitor.value + monitor.unit})`;
        
        let chart = {}, monitorChart={};
        monitorChart[monitorId]={
          loading:false,
          chart:{series:[]}
        }
        that.find({
          query: {
            deviceId: that.echartCrt.id ,
              monitorId: monitorId,
              gap:that.envChartGap
            }
          }).then(data =>{
              opt.title.text=monitorTitle
              chart = echarts.xparse(opt, data[0], conf)
               monitorChart[monitorId].chart=chart
               // !!!! vue 对象更改检测注意事项
              //   https://cn.vuejs.org/v2/guide/list.html#对象更改检测注意事项
              that.echartMonitorData = Object.assign({}, that.echartMonitorData, monitorChart)
            })  
            .catch(e =>{
              //TODO error 返回空数组 
              opt.title.text=monitorTitle
              chart = echarts.xparse(opt, mockData, conf);  
               monitorChart[monitorId].chart=chart
              that.echartMonitorData = Object.assign({}, that.echartMonitorData, monitorChart)
            })   
       // console.log('-=--=', monitorId, that.echartMonitorData)
      },
      resetEchartData(id){
        //重新请求图表数据
        let initData ={}
        initData[id]= {'loading':true,'chart': {series:[]} } 
        this.echartMonitorData = Object.assign({}, this.echartMonitorData, initData)
       this.getEchartData(id)
      },
      ...mapActions('environment_chart', {
        find: 'find',
      }),
      ...mapMutations('environment_chart', {
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
  .monitor-title{
    margin: 1.5rem .5rem;
  }
  .chart-padding{
    padding: 0;
  }

  .echarts {
    padding:10px;
    width: 100vw;
    height: 30vh;
  }
</style>