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
        <div class="layout-padding list-padding">
          <a class="animate-pop refresh-message" v-if="getTktCut" @click='getNewMsg()'>
          <span>+{{ getTktCut }} </span>  
        </a>
          <div class="row wrap justify-stretch content-center text-center list-filters ">
            <div class="auto">
              <q-select class=" list-btn" type="list" v-model="selectSys" :options="_system"></q-select>
            </div>
            <div class="auto filter-padding">
              <q-select class=" list-btn" type="list" v-model="selectType" :options="stateItems"></q-select>
            </div>
            <div class="auto ">
              <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
            </div>
          </div>
          <q-pull-to-refresh :handler="loadMore" :release-message='rlsmsg' :pull-message='plmsg' :refresh-message='rfhmsg'>
            <div class="list item-inset-delimiter no-border t-base" v-if="message.length">
              <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
                <i :class="item.priority|getPrtColo(item.state[0].name )" class="item-primary item-icon">{{item.state[0].name|gettktIcon }}</i>
                <div class="item-content has-secondary list-content ">
                  <div>
                    {{item.system|tran(systemItems)}} ({{ item.state[0].name|tran(stateItems) }})
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

            <div class="row justify-center " style="margin: 5px 0;">
              <q-progress-button v-if="(isFinished&&total)&&getErrFlag==false" :success-icon='pgmsg' @click.native='getMore()' class="light text-black full-width load "
                :percentage="progressBtn" dark-filler> 加载更多(剩余{{total}}条) </q-progress-button>
              <div :class="isTipsHG||message.length==0? 'tips-height':''" class='row justify-center tips text-grey'>
                <span v-if='tipsMsg'>  {{tipsMsg}} </span>
                <err v-if='getErrFlag'/>
              </div>
            </div>
          </q-pull-to-refresh>
        </div>
      </div>
      <button class="absolute-bottom-right raised circular teal fix-add" @click="add()"><i>add</i>
    </button>
    </q-layout>
    <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-layout v-if='isEdit'>
        <div slot="header" class="toolbar">
          <button class="head_goback" @click="$refs.layoutModal.close()">
              <i>arrow_back</i>
          </button>
          <q-toolbar-title :padding="1">
            报障详情
          </q-toolbar-title>
        </div>
        <tk-detail/>
      </q-layout>
      <q-layout v-if='isCreated'>
        <div slot="header" class="toolbar">
          <button class="head_goback" @click="$refs.layoutModal.close()">
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
  Vue.component('tkDetail', detail);
  let _moment = moment(0, "h"),
    timeMap = {
      NOW: _moment.toISOString(),
      WEEK: _moment.subtract(7, 'days').toISOString(),
      MONTH: _moment.subtract(1, 'months').toISOString(),
    };
  import filtersStorage from '../conf/storage'

  export default {
    data() {
      let _dt = {
        tipsMsg:null,
        pgmsg: '',
        tktCut:0,
        isTipsHG: false,
        isFinished: true,
        _isKey: false,
        total: null,
        isDone: false,
        rfhmsg: '正在刷新',
        plmsg: '下拉刷新',
        rlsmsg: '松开刷新',
        progressBtn: 0,
        isCreated: false,
        isEdit: false,
        selectType: filtersStorage('selectType') || '0',
        selectTime: filtersStorage('selectTime') || 'NOW',
        prird: filtersStorage('prird') || false,
        selectSys: filtersStorage('system') || 'ALL',
      }
      return Object.assign(_dt, _list)
    },
    name: 'list',
    computed: {
      ...mapGetters(['getGlbErr', 'getCtCut']),
      getErrFlag(){
        return this.getGlbErr.isFlag
      },
      ...mapGetters('tickets', {
        message: 'list',
      }),
      ...mapState('tickets', {
        tktCrt: 'copy',
      }),
      ...mapState(['systemItems', '_system', 'tickets', 'stateItems']),
      getTktCut(){
        return this.getCtCut.tktCut
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getApi()
        feathers.service('tickets').on('created', res => {
          this.tktCut += 1
          this.setAddCount({tktCut: this.tktCut})
          this.filterTkt([res])
        });
        feathers.service('tickets').on('patched', res => {
          console.log('--!!!!!patched!!!!!==', res)
        })
      })
    },
    watch: {
      searchModel(cc, pp) {
        if (cc == '') {
          this.setFilters()
        }
      },
      selectSys(c, p) {
        filtersStorage({
          key: "system",
          value: c
        }, "save")
        this.setFilters()
      },
      selectType(c, p) {
        filtersStorage({
          key: "selectType",
          value: c
        }, "save")
        this.setFilters()
      },
      selectTime(c, p) {
        filtersStorage({
          key: "selectTime",
          value: c
        }, "save")
        this.setFilters()
      },
      prird(c, p) {
        filtersStorage({
          key: "prird",
          value: c
        }, "save")
        this.setFilters()
      },
    },
    components: {
      popover,
    },
    filters: {
      gettktIcon(obj) {
        let map = {
          0: 'assignment_late',
          1: 'assignment',
          2: 'assignment_turned_in'
        }
        return map[obj]

      },
      getPrtColo(obj, src) {
        if (src == 2) {
          return 'text-green-6'
        } else {
          let colr = {
            1: '',
            2: 'text-yellow-8',
            3: 'text-red-4',
          }
          return colr[obj]
        }
      }
    },
    methods: {
      ...mapMutations(['setAddCount']),
      setFilters(sus) {
        this.tktCut = 0
        this.setAddCount({tktCut:0})
        this.clear()
        this.isFinished = false
        this.progressBtn = 0
        this.skip = 0
        this.getApi(sus)
      },
      getNewMsg() {
        this.setFilters()
      },
      searchKey() {
        //  this._isKey=true
        this.setFilters()
      },
      getMore() {
        this.skip = this.message.length
        this.getApi()
      },
      getApi(done) {
        let _self = this
        _self.isLoading = true
        _self.tipsMsg = null
        let _query = {
          $skip: _self.skip,
          $limit: _self.limit,
          $select: ['reportTime', 'system', 'state', 'priority', 'description', 'id']
        }
        if (_self.searchModel !== '') {
          _query['$search'] = _self.searchModel
        }
        if (_self.selectType !== 'ALL') {
          _query['state'] = _self.selectType
        }
        if (_self.selectSys !== 'ALL') {
          _query['system'] = _self.selectSys
        }
        if (_self.prird) {
          _query['$sort'] = {
            priority: -1
          }
        } else {
          _query['$sort'] = {
            reportTime: -1
          }
        }
        if (_self.selectTime !== 'ALL') {
          _query['$$start'] = timeMap[_self.selectTime]
        }
  
          console.log('--==-', _query)
      _self.findMessages({
          query: _query
        }).then((res) => {
          if (res.total == 0) {
            _self.isTipsHG = true
          } else {
            _self.isTipsHG = false
          }
          let _perct = Math.pow(10, 2) / res.total
          _self.total = res.total - _self.message.length
          console.log('-=-', _perct)
          _self.progressBtn = _self.message.length * _perct
          if (res.data.length == 0 && _self.message.length == 0) {
            _self.tipsMsg = '＞﹏＜...空空如也.'
            console.log('-=[sdf]')
            _self.isFinished = false
            if (_self.searchModel) {
              console.log('-search--=1-')
              _self.tipsMsg = '很抱歉，没有找到与\"' + _self.searchModel + '\"相关的数据.'
            }
            _self.progressBtn = 100
          } else {
            if (_self.total == 0) {
              _self.tipsMsg = '没有更多数据了.'
            }
          }
          if (res.data.length < _self.limit) {
            _self.isFinished = false
          } else {
            _self.isFinished = true
          }
          _self.isLoading = false
          done instanceof Function ? done() : '';
          console.log('-=res--', _self.tipsMsg, res.data)
        })
      },
      loadMore(done) {
        if (this.isLoading == false) {
          console.log('-=loadMore=--')
          this.setFilters(done)
        }
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
      ...mapActions('tickets', {
        getTkt: 'get',
      }),
      ...mapMutations('tickets', {
        clearCrt: 'clearCurrent'
      }),
      notify() {
        this.isCreated = false
        this.isEdit = false
        this.$refs.layoutModal.close();
        this.clearCrt()
      },
      getDetail(id) {
        this.getTkt(id)
        this.isEdit = true
        this.$refs.layoutModal.open()
      },
      add() {
        this.isCreated = true
        this.$refs.layoutModal.open()
      },
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
    destroyed: function () {
      this.tipsMsg = null
    },
  }

</script>
<style>
  .list-padding {
    padding-top: 0;
  }

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

  .list-filters {
    position: relative;
    z-index: 9;
    height: 40px;
    padding-top: 5px;
    background: white;
  }

  .q-picker-textfield .q-picker-textfield-value {
    font-size: 1rem;
    height: auto;
  }

  .q-popover .item-container {
    height: 38px;
  }

  .pop-list {
    min-width: 120px;
    max-height: 500px;
  }

  .filter-padding {
    padding: 0 3px;
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

  .load {
    border: 1px solid #dcdfde;
  }

  .tips {
    align-items: center;
  }

  .pull-to-refresh-message {
    color: black;
  }

  .tips-height {
    min-height: 60vh;
  } 
  .fix-add {
    right: 18px;
    justify-content: center;
    bottom: 18px;
    z-index: 9;
  }

</style>
