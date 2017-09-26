<template>
<div>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button> 
      <q-toolbar-title :padding="1">
        报障清单 
      </q-toolbar-title>
       <button>
          <i>more_vert</i>
          <q-popover ref="popover" anchor="top left" self="bottom left" class="bg-white text-black">
            <div class="list highlight pop-list ">
              <div class="item">
                <div class="item-content"  >
                <label>
                   按优先级排序 <q-toggle v-model="prird"></q-toggle>
                </label>
                </div>
              </div>
            </div>
          </q-popover>
        </button>
    </div> 
    <div slot="header" class="toolbar">
      <q-search class="full-width" v-model="searchModel" @enter='searchKey()' placeholder="搜索..."></q-search>
    </div>
    <div class="layout-view">
      <div class="layout-padding">
        <a class="animate-pop refresh-message" v-if="tkt_count" @click='getNewMsg()' >
          <span>+{{ tkt_count }} </span>  
        </a>
        <div class="row wrap justify-stretch content-center text-center list-filters ">
          <div class="auto">
            <q-select class=" list-btn" type="list" v-model="selectSys" :options="_system"></q-select>
          </div>
          <div class="auto">
            <q-select class=" list-btn" type="list" v-model="selectType" :options="stateItems"></q-select>
          </div>
          <div class="auto ">
            <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
          </div>
        </div>
        <q-pull-to-refresh :handler="loadMore" >
          <div class="list item-inset-delimiter no-border t-base" v-if="message.length">
            <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
              <i :class="item.priority|getPrtColo(item.state[0].name )" class="item-primary item-icon">{{item.state[0].name|gettktIcon }}</i>
              <div class="item-content has-secondary list-content ">
                <div>
                  {{item.system|tran(systemItems)}}
                  ({{  item.state[0].name|tran(stateItems) }})
                </div>
                <div class="list-desc">
                  {{item.description}}
                </div>
              </div>
              <div class='list-time'>
                {{item.reportTime | date}}
              </div>
              <i class="item-secondary icon item-arrow">keyboard_arrow_right</i>
            </div>
          </div>
          <div>
          </div>
         <div class="row justify-center" style="margin: 5px 0;">
            <button v-if="fetched" class="bordered light text-black full-width load" @click='getMore()'>加载更多</button>
            <div  v-if="fetched==false">
              <div v-if='tips'>
                <router-link to='/login' v-if='Islogined'> {{tips}} </router-link>
                <span v-else>  {{tips}} </span>
              </div>
              <div v-else>
                {{"共计"+message.length+"条数据" }}
              </div>
            </div>   
          </div>
        </q-pull-to-refresh>
      </div>
    </div>
    <button class="absolute-bottom-right raised circular teal fix-add" @click="add()"><i class="q-fab-icon">add</i>
    </button>
  </q-layout>
  <q-modal ref="layoutModal" :content-css="{minWidth: '100vw', minHeight: '100vh'}">
    <q-layout v-if='isEdit'>
        <div slot="header" class="toolbar">
          <button class="head_goback" @click="getTktDt()">
              <i>arrow_back</i>
          </button>
          <q-toolbar-title :padding="1">
              报障详情 
          </q-toolbar-title>
        </div>
        <detail></detail>  
    </q-layout>
     <q-layout v-if='isCreated'>
        <div slot="header" class="toolbar">
          <button class="head_goback" @click="getTktNew() ">
              <i>arrow_back</i>
          </button>
          <q-toolbar-title :padding="1">
              新增报障 
          </q-toolbar-title>
        </div>
        <new></new>  
    </q-layout>
  </q-modal>
</div>  
</template>
<script>
  import {
    _list
  } from './data'
  import moment from 'moment'
  import {
    mapGetters,
    mapMutations,
    mapState,
    mapActions
  } from 'vuex'
  import {
    Toast
  }
  from 'quasar'
  import popover from '../layout/popover'
  import detail from './detail'
  import nnew from './new'
  import Vue from 'vue'
  Vue.component('new', nnew);
  Vue.component('detail', detail);
  let _moment = moment(0, "h"),
   timeMap = {
     NOW: _moment.toISOString(),
     WEEK: _moment.subtract(7, 'days').toISOString(),
     MONTH: _moment.subtract(1, 'months').toISOString(),
   };
  let filtersStorage = {
    type() {
      return JSON.parse(localStorage.getItem("selectType")) ;
    },
    time(){
      return JSON.parse(localStorage.getItem("selectTime")) ;
    },
    sys(){
      return JSON.parse(localStorage.getItem("system")) ;
    },
    prir(){
      return JSON.parse(localStorage.getItem("prird")) ;
    },
    save (key,filters) {
      localStorage.setItem(key, JSON.stringify(filters));
    }
  }
  export default {
    data() { 
      let _dt = {
        isCreated:false,
        isEdit:false,
        selectType:filtersStorage.type() ||'0' ,
        selectTime:filtersStorage.time() ||'NOW' ,
        prird: filtersStorage.prir() || false,
        selectSys:filtersStorage.sys() ||'ALL' ,
        Islogined:false,
      }
      return Object.assign(_dt, _list)
    },
    name:'list',
    computed: {
      ...mapGetters('tickets', {
        message: 'list',
      }), 
      ...mapState('tickets', {
        tktCrt: 'copy',
      }), 
      ...mapState(['systemItems','tkt_count','_system', 'stateItems']),
    },
    mounted() {
      this.$nextTick(() => {
        feathers.service('tickets').on('created', res => {
          this.$store.state.tkt_count += 1
          console.log('rrrr', this.$store.state.tkt_count, res)
          this.filterTkt([res])
        });
        feathers.service('tickets').on('patched', res => {
          console.log('--!!!!!patched!!!!!==', res)
        })
      })
    },
    watch:{
      selectSys(c, p) {
        filtersStorage.save("system",c)
        this.setFilters()
      },
      selectType(c, p) {
        filtersStorage.save("selectType",c)
        this.setFilters()
      },
      selectTime(c, p) {
        filtersStorage.save("selectTime",c)
        this.setFilters()
      },
      prird(c, p) {
        filtersStorage.save("prird",c)
        this.setFilters()
      },
    },
    components: {
      popover,
    },
    filters:{
      gettktIcon(obj){
        let map={
          0:'assignment_late',
          1:'assignment',
          2:'assignment_turned_in'
        }
        return map[obj]
        
      },
      getPrtColo(obj, src){
          if(src==2){
            return 'text-green-6'
          }else{
            let colr={
                1:'',
                2:'text-yellow-6',
                3:'text-red-4',
              }
              return colr[obj]
          }
      }
    },
    methods: {
      setFilters(){
        this.$store.state.tkt_count=0
        this.clear()
        this.skip = 0
        this.getApi()
      },
      ...mapActions('tickets', {
        getTkt: 'get',
      }), 
      ...mapMutations('tickets', {
        clearCrt: 'clearCurrent'
      }),
      getTktDt(){
        this.isEdit=false
         this.$refs.layoutModal.close();
         this.clearCrt() 
      },
      getTktNew(){
         this.$refs.layoutModal.close();
         this.isCreated=false
      },
      getDetail(id) {
        this.getTkt(id)
        this.isEdit=true
        this.$refs.layoutModal.open()
      },
      add() {
        this.$refs.layoutModal.open()
        this.isCreated=true
      },
      getNewMsg(){
        this.setFilters()
      },
      ...mapMutations('tickets', {
        clear: 'clearAll',
      }),
      ...mapMutations('tickets', {
        filterTkt: 'removeItems',
      }),
      ...mapActions('tickets', {
        findMessages: 'find',
      }),
      searchKey() {
        this.setFilters()
      },
      getMore(){
        this.skip=this.message.length
        this.getApi()
      },
      getApi(obj) {
        let _self = this
        _self.isLoading = true
        _self.fetched = true
        _self.tips = null
        let _query = {
          $skip:_self.skip,
          $limit: _self.limit,
          $select: [ 'reportTime', 'system', 'state','priority', 'description', 'id']
        }
        if (_self.searchModel!== '' ) {
          _query['$search'] = _self.searchModel
        } 
        if (_self.selectType !== 'ALL') {
          _query['state'] = _self.selectType
        }
        if (_self.selectSys !== 'ALL') {
          _query['system']=_self.selectSys
        }
        if(_self.prird){
          _query['$sort'] = {priority:-1}
        }else{
          _query['$sort'] = {reportTime:-1}
        }
        if (_self.selectTime !== 'ALL') {
          _query['$$start'] =  timeMap[_self.selectTime]
        }
        console.log('--==-', _query)

        _self.findMessages({
            query: _query
          }).then((res) => {
            if (res.data.length == 0 &&  _self.message.length==0 ) {
              _self.tips = '木有了.'
              console.log('-=[sdf]')
              _self.fetched = false
              if (obj) {
                console.log('-search--=1-')
                _self.tips = '没有搜索到相关数据.'
              }
            }
            if (res.data.length < _self.limit) {
              _self.fetched = false
            } else {
              _self.isLoading = false
            }
            console.log('-=res--', _self.tips, res.data)
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            console.log('-=:[]', error)
            this.fetched = false
             this.$store.state.tkt_count = 0
            this.Islogined=error.code==401?true:false
            this.tips =error.code==401? '认证失败，请重新登录': '哦,服务崩溃，稍后再试'
            Toast.create.negative({
              html: this.tips ,
              timeout: 3000
            })
          })

      },
      loadMore(done) {
        if (this.isLoading == false) {
          console.log('-=loadMore=--')
          this.getApi()
        }
        done()
      },
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
    activated() {
      this.getApi()
      console.log('-----activated--')
    },
    deactivated() {
      console.log('-----deactivated--')
      this.tips = null
      this.Islogined = false
    },
  }
</script>
<style>
  .list-btn {
    width: 100%;
  }

  .list-desc {
    color: #999;
    padding-top: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
.list-filters{
  position:relative;
  z-index:9;
  background:white;
}
  .q-popover .item-container {
    height: 38px;
  }
  .pop-list{
    min-width: 120px; 
    max-height: 500px;
  }

  .list-time {
    position: absolute;
    top: 0;
    width: 150px;
    color: #666;
    margin: 12px 35px;
    right: 4px;
    line-height: 24px;
    font-size: 10px;
    text-align: right;
  }
.load{
      border: 1px solid;
}
  .fix-add {
    right: 18px;
    bottom: 18px;
    z-index:9;
  } 

</style>
