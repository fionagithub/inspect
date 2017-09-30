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
    <div slot="header" class="toolbar">
      <q-search class="full-width" disable v-model="searchModel" @enter='setFilters()' placeholder="搜索..."></q-search>
    </div>
    <div class="layout-view">
      <div class="layout-padding">
        <a class="animate-pop refresh-message" v-if="this.$store.state.add_count.dvCut" @click='setFilters()'>
          <span>+{{ this.$store.state.add_count.dvCut }} </span>  
        </a>
        <q-pull-to-refresh :handler="loadMore" :release-message='rlsmsg' :pull-message='plmsg' :refresh-message='rfhmsg'>
          <div class="list item-inset-delimiter no-border t-base ">
            <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
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
            <q-progress-button v-if="isFinished&&total" :success-icon='pgmsg' @click.native='getMore()' class="light text-black full-width load "
              :percentage="progressBtn" dark-filler> 加载更多(剩余{{total}}条) </q-progress-button>
            <div :class="isTipsHG? 'tips-height':''" class='row justify-center tips text-grey' v-if='tips'>
              <router-link to='/login' v-if='Islogined'> {{tips}} </router-link>
              <span v-else>  {{tips}} </span>
            </div>
          </div>
        </q-pull-to-refresh>
      </div>
    </div>
    <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <dv-detail v-if='isEdit'/>>
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
        isFinished: true,
        isTipsHG: false,
        pgmsg: '',
        total: null,
        progressBtn: 0,
        isEdit: false,
        rfhmsg: '正在刷新',
        plmsg: '下拉刷新',
        rlsmsg: '松开刷新',
        Islogined: false

      }
      return Object.assign(_dt, _list)
    },
    computed: {
      ...mapGetters('devices', {
        message: 'list',
      }),
      ...mapState('add_count', {
        dvCut: 'dvCut',
      }),
      ...mapState(['_version']),

    },
    created() {
      feathers.service('devices').on('patched', res => {
        console.log('--!!!!!!!!!!==', res)
        this.ptdDV(res)
      })
    },
    watch: {
      searchModel(c, o) {
        if (c == '') {
          this.clear()
          this.skip = 0
          this.getApi()
        }
      }
    },
    mounted() {
      this.getApi() //请求初始数据 
      this.$nextTick(() => {
        feathers.service('devices').on('created', res => {
          this.$store.state.this.$store.state.add_count.dvCut += 1
          console.log('rrrr', this.$store.state.this.$store.state.add_count.dvCut, res)
          this.filterDV([res])
        });
      })
    },
    methods: { 
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
          $select: ['location', 'name', 'id']
        }
        if (_self.searchModel !== '') {
          _query['$search'] = _self.searchModel
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
              _self.isFinished = false
              _self.tips = '＞﹏＜...空空如也.'
              console.log('-=[sdf]')
              if (_self.searchModel) {
                console.log('-search--=1-')
                _self.tips = '很抱歉，没有找到与\"' + _self.searchModel + '\"相关的数据.'
              }
              _self.progressBtn = 100
            } else {
              if (_self.total == 0) {
                _self.tips = '没有更多数据了.'
              }
            }
            if (res.data.length < _self.limit) {
              _self.isFinished = false
            } else {
              _self.isFinished = true
            }
            _self.isLoading = false
            done instanceof Function ? done() : '';
            console.log('-=res--', _self.tips, res.data)
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            console.log('-=:[]', error)
            this.isFinished = false
            this.$store.state.this.$store.state.add_count.dvCut = 0
            this.Islogined = error.code == 401 ? true : false
            done instanceof Function ? done() : '';
            this.tips = error.code == 401 ? '认证失败，请重新登录' : '哦,服务崩溃，稍后再试'
            Toast.create.negative({
              html: '服务崩溃，稍后再试',
              timeout: 3000
            })
          })
      },
      setFilters(sus) {
        this.$store.state.this.$store.state.add_count.dvCut = 0
        console.log(this)
        this.clear()
        this.isFinished = false
        this.progressBtn = 0
        this.skip = 0
        this.getApi(sus)
      },
      loadMore(done) {
        if (this.isLoading == false) {
          console.log('-=loadMore=--')
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
    z-index: 99;
  }

</style>
