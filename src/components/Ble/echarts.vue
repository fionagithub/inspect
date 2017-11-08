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
        <div class="echarts">
          <IEcharts :option="bar"></IEcharts>
        
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
    mapMutations,
    mapActions
  } from 'vuex'
  let _moment = moment(0, "h")
  export default {
    name: 'view',
    data(){
        return{
          api: feathers.env_api,
          theme: 'dark',
          title: '曲线图',
          loading: true,
          bar:{
            tooltip: {},
            xAxis: {
              data:[]
            },
            yAxis: {},
            series: []
          },
          bar_conf:{
           'default' : { 
             name: 'Sales',
              type: 'bar',
              data:[]}
          },
          loading2: false,
          bar2: {
            tooltip: {},
            xAxis: {
              data:[]
             // data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
            },
            yAxis: {},
            series: [{
              name: 'Sales',
              type: 'bar',
              data:[]
           //   data: [5, 20, 36, 10, 10, 20]
            }]
          }
      }
    },
    computed:{
      ...mapState('auth',['accessToken'] ),
    
    },
    created(){
     // this.getData()
     this._getData()
    },
    methods: {
      onReady(instance) {
      },
      _getData(){
        let conf = this.bar_conf, opt = this.bar;
        let _data = {
          values: [{ "name": "时间",'data': [70, 23] }],
          x: {"name": "时间", 'data': ['2017/10/23', '2017/10/24'] },
          z: { 'data': ['温度'] },
        };
        this.bar=echarts.xparse(opt, _data, conf);
        console.log('[00-=][]', conf, opt)
      /*   let params = {
          deviceId: 'asudia-asd',
          monitorId: 'asdas-12sd',
          end: _moment.toISOString(),
          start: _moment.subtract(7, 'days').toISOString(),
        }
          let url =`${this.api}/?deviceId=${params.deviceId}&monitorId=${params.monitorId}&$$start=${params.start}&$$end=${params.end}`
          fetch(url, { headers: { 'Authorization': this.accessToken }})
          .then(response => response.json())
          .then(data =>{
              })
          .catch(e => console.log("--=Oops, error=-=", e))*/
      },
      getData(){
        let params= { 
          deviceId:'asudia-asd',
          monitorId:'asdas-12sd',
          end:  _moment.toISOString(),
          start: _moment.subtract(7, 'days').toISOString(),
        }  
          let url =`${this.api}/?deviceId=${params.deviceId}&monitorId=${params.monitorId}&$$start=${params.start}&$$end=${params.end}`
          fetch(url, { headers: { 'Authorization': this.accessToken }})
          .then(response => response.json())
          .then(data =>{
              data={
                values:[{data:[70,23]}],
                x:{data:['2017/10/23','2017/10/24']}
              }
              this.loading=false
              this.bar2.xAxis.data= this.x_data=data.x.data
              this.bar2.series[0].data =  this.s_data=data.values[0].data
             })
          .catch(e => console.log("Oops, error", e))
      },
      onReady2(instance) {
       // console.log('[]-',instance)
      },
      doRandom() {
        const that = this
        let data = []
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          data.push(Math.floor(Math.random() * (max + 1 - min) + min))
        }
        that.loading = true
        that.bar.xAxis.data = ['Shirt1', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
        that.bar.series[0].data = data
        that.loading = false
        setInterval(function () {
          that.bar.series[0].data.shift()
          that.bar.series[0].data.push(Math.random())
          that.bar.xAxis.data.shift()
          that.bar.xAxis.data.push(Math.random())
        }, 2000)
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
    height: 400px;
    margin:10px;
  }
</style>