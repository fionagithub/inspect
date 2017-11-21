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
      <div class="layout-padding chart-padding" v-if='echartsArray.length'  >
        <p class="caption monitor-title"> {{echartCrt.name}} </p>

        <div class="echarts" v-for='(chart, index) in echartsArray' :key="index" >
          <IEcharts :option="chart"></IEcharts>
        
          <!--<IEcharts :option="bar2" :theme="theme" @ready="onReady2"></IEcharts>-->
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script type="text/babel">

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
          echartTitleConf:{},
          loading: true,
          echartsArray:[],
          echartOpt:{
            title: {
                text: ''
            },
            tooltip: {},
            grid:{
              top:40,
              left:40,
              bottom: 30,
            },
            xAxis: {
              data:[],
              axisLabel:{
                formatter(value,index){
                   var date = moment(value).format('h:mm')
                    return date;
                }
              }
            },
            yAxis: {},
            series: []
          },
          echartConf:{
           'default' : { 
             name: 'Sales',
              type: 'line',
              smooth: true,
              data:[]}
          },
      }
    },
    computed:{
      ...mapGetters('devices', {
        echartCrt: 'current',
      }),
      ...mapGetters('monitors', {
        mtrList: 'list',
      }),
    },
    mounted(){
      this.echartTitleMatch()
    },
    watch:{
      echartCrt(val){
        if(val){
          this.getEchartData()
        }
      }
    },
    methods: {
      ...mapActions('environment_chart', {
        find: 'find',
      }),
      ...mapActions('environment_chart', {
        get: 'get',
      }),
      ...mapMutations('environment_chart', {
        clear: 'clearAll',
      }),
      ...mapActions('monitors', {
        findMtrApi: 'find',
      }),
      echartTitleMatch() {
        this.findMtrApi().then(()=>{
          for (var i in this.mtrList ){
            let mtrStack= this.mtrList[i]
            let mtrName =mtrStack.name||mtrStack.monitorUri
            let mtrUnit=mtrStack.unit
            this.echartTitleConf[mtrStack.id]=`${mtrName} (${mtrUnit||''}) ` 
          }
        })
      },
      getEchartData(){
        let vm =this
        let deviceId=vm.echartCrt.id
        let mtrId=Object.keys(vm.echartCrt.monitors)
        let conf = vm.echartConf, opt = vm.echartOpt;
        for(let i in mtrId){
          //  console.log('--qq---', mtrId)
          (function(id){
            vm.find({
              query: {
                deviceId: deviceId,
                  monitorId: id,
                  gap:10
                }
              }).then(data =>{
                opt.title.text=vm.echartTitleConf[id]
                  vm.echartsArray.push(echarts.xparse(opt, data[0] , conf));
                 // console.log('[00-=][]',  data)
                })  
                .catch(e =>{
                  //TODO error 返回空数组
                    let data={
                      values:[],
                      z:{
                        data:[]
                      },
                      x:{
                        data:[]
                      }
                    }
                   vm.echartsArray.push(echarts.xparse(opt, data , conf));
               /*    if(JSON.stringify(e)=='{}'){
                  }else{
                    vm.echartsArray.push(echarts.error)
                  } */
                  console.log("--=Oops, error=-=", JSON.stringify(e), e)
                }) 
          })(mtrId[i])
        }
      },
      onClick(event, instance, echarts) {
      }
    },
    components: {
      IEcharts
    },
  }
</script>

<style scoped>
  .monitor-title{
    padding: 1.5rem .5rem;

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