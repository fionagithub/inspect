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
      <div class="layout-padding " v-if='echartsArray.length'  >
        <div class="echarts" v-for='chart in echartsArray' >
          <IEcharts :option="chart"></IEcharts>
        
          <!--<IEcharts :option="bar2" :theme="theme" @ready="onReady2"></IEcharts>-->
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.vue'
  import queryString from 'query-string'
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
          api: feathers.env_api,
          theme: 'dark',
          title: '曲线图',
          loading: true,
          echartsArray:[],
          bar:{
            tooltip: {},
            grid:{
              left:50,
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
          bar_conf:{
           'default' : { 
             name: 'Sales',
              type: 'line',
              data:[]}
          },
      }
    },
    computed:{
      ...mapGetters('devices', {
        echartCrt: 'current',
      }),
    },
    mounted(){
      let vm =this
    },
    watch:{
      echartCrt:{
        handler(val){
          if(val){
            // console.log('--cc--', val)
            this._getData()
          }
        },
        deep:true
        
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
      onReady(instance) {
      },
      _getData(){
        let vm =this
        let conf = vm.bar_conf, opt = vm.bar;
        let _eid=vm.echartCrt.id
         let params = {
             deviceId:_eid,
         }

          let m_id=Object.keys(vm.echartCrt.monitors)
          for(let i in m_id){
            // console.log('--qq---', m_id)
            (function(_mid){
               vm.find({
                  query: {
                    deviceId: _eid,
                    monitorId: _mid,
                    gap:10
                  }
               }).then(data =>{
                    vm.echartsArray.push(echarts.xparse(opt, data[0] , conf));
                    console.log('[00-=][]',  data)
                 })  
                 .catch(e => console.log("--=Oops, error=-=", e))
            })(m_id[i])
          }
         // console.log('--echarts---', vm.echartsArray)
      },
      onClick(event, instance, echarts) {
     //   console.log(feathers.env_api)
      }
    },
    components: {
      IEcharts
    },
  }
</script>

<style scoped>
  .echarts {
    width: 400px;
    height: 250px;
    padding-right:10px;
  }
</style>