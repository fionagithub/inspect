<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button>
      <q-toolbar-title :padding="1">
        设备清单
      </q-toolbar-title>
    </div>
    <div class="layout-view">
      <div class="layout-padding">
        <a class="animate-pop refresh-message" v-if="getCtCut.dvCut" @click='setFilters()'>
          <span>+{{ getCtCut.dvCut }} </span>  
        </a>
        <q-pull-to-refresh class="d-pull" :handler="loadMore" :release-message='rlsmsg' :pull-message='plmsg' :refresh-message='rfhmsg'>
          <div class="list item-inset-delimiter no-border t-base ">
            <div class="item item-link multiple-lines" v-for="(item,index) in message " :key="index" @click="getDetail(item.id)">
              <i class="item-primary item-icon">mail</i>
              <div class="item-content has-secondary list-content ">
                <div>
                  {{item.name }}
                </div>
                <div class="list-desc">
                  {{item.location.building+"|"+item.location.floor+"|"+item.location.room}}
                </div>
              </div>
              <i class="item-secondary item-arrow">keyboard_arrow_right</i>
            </div>
          </div>
          <div class="row justify-center " style="margin: 5px 0;">
            <q-progress-button v-if="(isFinished&&surplus)&&getGlbErr.isFlag==false" :success-icon='pgmsg' @click.native='getMore()'
              class="light text-black full-width load " :percentage="progressBtn" dark-filler> 加载更多(剩余{{surplus}}条) </q-progress-button>
            <div :class="isTipsHG||message.length==0? 'tips-height':''" class='row justify-center tips text-grey'>
              <span v-if='tips'> {{tips}} </span>
              <err v-if='getGlbErr.isFlag' />
            </div>
          </div>
        </q-pull-to-refresh>
      </div>
    </div>
    <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <dv-detail v-if='isEdit' />
    </q-modal>
  </q-layout>
</template>
<script>
  import Vue from 'vue'
  import detail from './detail'
  import {
    _list
  } from './data'
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
  Vue.component('dvDetail', detail);
  export default {
    name: 'device',
    data() {
      let _dt = {
        dvCut: 0,
        w_search_dtl: {
          searchModel: '',
        },
        isFinished: true,
        isTipsHG: false,
        pgmsg: '',
        total: 0,
        progressBtn: 0,
        isEdit: false,
        rfhmsg: '正在刷新',
        plmsg: '下拉刷新',
        rlsmsg: '松开刷新',
        selectFld: ['location', 'name', 'id'],
      }
      return Object.assign(_dt, _list)
    },
    computed: {
      ...mapGetters(['getGlbErr', 'getCtCut']),
      ...mapGetters('devices', {
        message: 'list',
      }),
      surplus() {
        return this.total - this.message.length
      },
    },
    created() {},
    mounted() {
      this.$nextTick(() => {
      this.getApi() //请求初始数据 
        Win_devices_.on('patched', res => {
         // console.log('--!!!!!!!!!!==', res)
          this.ptdDV(res)
        })
        Win_devices_.on('created', res => {
          this.dvCut += 1
          this.setAddCount({
            dvCut: this.dvCut
          })
          this.filterDV([res])
        });
      })
    },
    methods: {
      ...mapActions(['setError']),
      getMore() {
        this.skip = this.message.length
        this.getApi()
      },
      ...mapMutations('devices', {
        ptdDV: 'updateItem'
      }),
      ...mapMutations('devices', {
        clear: 'clearAll',
      }),
      ...mapMutations('devices', {
        clearCrt: 'clearCurrent'
      }),
      ...mapMutations('devices', {
        filterDV: 'removeItems',
      }),
      ...mapActions('devices', {
        findMessages: 'find',
      }),
      ...mapActions('devices', {
        getTkt: 'get',
      }),
      notify() {
        this.isEdit = false
        this.setError()
        this.$refs.layoutModal.close();
        this.clearCrt()
      },
      getApi(done) {
        let _self = this
        _self.isLoading = true
        _self.tips = null
        let _query = {
          $limit: _self.limit,
          $skip: _self.skip,
          $select: _self.selectFld
        }
      //  console.log('--==-', _query)

        _self.findMessages({
          query: _query
        }).then((res) => {
          _self.total = res.total
          _self.isTipsHG = res.total ? false : true
          let _perct = Math.floor(Math.pow(10, 2) / res.total)
          let msg = _self.message.length
          _self.progressBtn = msg * _perct
          if (res.data.length == 0 && msg == 0) {
            _self.isFinished = false
            let _model = _self.w_search_dtl.searchModel
            let s_tips = '很抱歉，没有找到与\"' + _model + '\"相关的数据.'
            let n_tips = '＞﹏＜...空空如也.'
            _self.tips = _model ? s_tips : n_tips
            // _self.progressBtn = 100
          } else {
            if (_self.surplus == 0) {
              _self.tips = '没有更多数据了.'
            }
          }
          _self.isLoading = false
          _self.isFinished = res.data.length < _self.limit ? false : true
          done instanceof Function ? done() : '';
          //  console.log('-=res--', _self.tips, res.data)
        })
      },
      setFilters(sus) {
        this.dvCut = 0
        this.setAddCount({
          dvCut: 0
        })
        this.clear()
        this.isFinished = false
        this.progressBtn = 0
        this.skip = 0
        this.getApi(sus)
      },
      loadMore(done) {
        if (this.isLoading == false) {
       //   console.log('-=loadMore=--')
          this.setFilters(done)
        }
      },
      getDetail(id) {
        this.getTkt(id)
        this.isEdit = true
        this.$refs.layoutModal.open()
      }
    },
    destroyed: function () {
      this.tips = null
    },
  }

</script>
<style>
  .list-btn {
    width: 100%;
  }
  .d-pull{
    margin-top: -20px;
  }

  .list-desc {
    color: #999;
    padding-top: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .q-popover .item-container {
    height: 38px;
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

  .icon {
    margin: 16px 12px!important;
  }

  .fix-add {
    right: 18px;
    bottom: 18px;
    z-index: 9;
  }

</style>
