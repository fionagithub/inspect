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
                  <p class="caption"> {{echartCrt.name}} </p>

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
          theme: 'dark',
          title: '历史曲线',
          E_name:{},
          loading: true,
          echartsArray:[],
          bar:{
            title: {
                text: ''
            },
            tooltip: {},
            grid:{
              top:50,
              left:80,
              bottom: 50,
              right:50
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
        mtrMsg: 'list',
      }),
    },
    mounted(){
      this.findMD()
    },
    watch:{
      echartCrt(val){
        if(val){
            this._getData()
           // console.log('----www---')
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
        findMD: 'find',
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

        for (var i in vm.mtrMsg ){
          let _data_= vm.mtrMsg[i]
          let _name =_data_.name||_data_.monitorUri
          let _unit=_data_.unit
          vm.E_name[_data_.id]=`${_name} (${_unit||''}) ` 
        }

          let m_id=Object.keys(vm.echartCrt.monitors)
          for(let i in m_id){
           //  console.log('--qq---', m_id)
            (function(_mid){
               vm.find({
                  query: {
                    deviceId: _eid,
                    monitorId: _mid,
                    gap:10
                  }
               }).then(data =>{
                 opt.title.text=vm.E_name[_mid]
                    vm.echartsArray.push(echarts.xparse(opt, data[0] , conf));
                    console.log('[00-=][]',  data)
                 })  
                 .catch(e =>{
                   vm.echartsArray.push(echarts.error)
                   console.log("--=Oops, error=-=", e)}) 
            })(m_id[i])
          }
         // console.log('--echarts---', vm.echartsArray)
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
  .echarts {
    width: 100vw;
    height: 30vh;
  }
</style>