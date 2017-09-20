<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button> 
      <q-toolbar-title :padding="1">
        报障清单 
      </q-toolbar-title>
      <popover></popover>
    </div> 
    <div slot="header" class="toolbar">
      <q-search class="full-width" v-model="searchModel" @enter='searchKey()' placeholder="搜索..."></q-search>
    </div>
    <div class="layout-view">
      <div class="layout-padding">
        <a class="animate-pop refresh-message" v-if="tkt_count" @click='getNewMsg()' >
          <span>+{{ tkt_count }} </span>  
        </a>
     <div class="row gutter wrap justify-stretch content-center text-center">
          <div class="auto">
            <q-select class=" list-btn" type="list" v-model="selectType" :options="stateItems"></q-select>
          </div>
          <div class="auto ">
            <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
          </div>
        </div>
        <q-infinite-scroll :handler="loadMore" ref="infiniteScroll" :offset="100">
          <div class="list item-inset-delimiter no-border " v-if="message.length">
            <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
              <i class="item-primary">mail</i>
              <div class="item-content has-secondary">
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
              <i class="item-secondary icon">keyboard_arrow_right</i>
            </div>
          </div>

          <div class="row justify-center" style="margin-bottom: 50px;">
            <spinner name="dots" slot="message" :size="40" v-if="fetched">
            </spinner>
            <div slot="message" :size="40" v-if="fetched==false">
              <div v-if='tips'>
                <router-link to='/login' v-if='Islogined'> {{tips}} </router-link>
                <span v-else>  {{tips}} </span>
              </div>
              <div v-else>
                {{"共计"+message.length+"条数据" }}
              </div>
            </div>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
    <button class="absolute-bottom-right raised circular teal fix-add" @click="add()"><i class="q-fab-icon">add</i>
    </button>
  </q-layout>
</template>
<script>
  import {
    _list
  } from './data'
//  import * as feathers from './api/feathers-config'
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
  export default {
    data() { 
      let _dt = {
        Islogined:false
     //   tkt_count:0
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
      ...mapState(['systemItems','tkt_count', 'stateItems'])
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        feathers.service('tickets').on('created', res => {
          this.$store.state.tkt_count += 1
          console.log('rrrr', this.$store.state.tkt_count, res)
          this.filterTkt([res])
        });
      })
    },
    watch: {
      selectType(c, p) {
        this.clear()
        this.skip = 0
        this.getApi()
      },
      selectTime(c, p) {
        this.clear()
        this.skip = 0
        this.getApi()
      },
      searchModel(c, o){
        if (c==''){
          this.clear()
          this.skip = 0
          this.getApi()
        }
      }
    },
    components: {
      popover
    },
    activated() {
      console.log('-----activated--')
      this.getApi() //请求初始数据 
    },
    deactivated() {
      console.log('-----deactivated--')
      this.tips = null
      this.Islogined = false
    },
    methods: {
      getNewMsg(){
        this.$store.state.tkt_count = 0
        this.clear()
        this.skip = 0
        this.getApi() //请求初始数据 
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
        this.clear()
        this.skip = 0
        this.getApi()
      },
      getApi(obj) {
        let _self = this
        _self.isLoading = true
        _self.fetched = true
        _self.tips = null
        let _query = {
          $limit: _self.limit,
          $sort:{reportTime:-1 },
          $select: [ 'reportTime', 'system', 'state', 'description', 'id']
        }
        if (_self.searchModel!== '' ) {
          _query['$search'] = _self.searchModel
        } 
          _query['$skip'] = _self.skip
        if (_self.selectType !== 'ALL') {
          _query['state'] = _self.selectType
        }
        if (_self.selectTime !== 'ALL') {
          _query['$$start'] =  _self.timeMap[_self.selectTime]
        }
        console.log('--==-', _query)

        _self.findMessages({
            query: _query
          }).then((res) => {
            if (res.data.length == 0 &&  _self.message.length==0 ) {
              _self.tips = '暂无数据.'
              console.log('-=[sdf]')
              _self.fetched = false
              if (obj) {
                console.log('-search--=1-')
                _self.tips = '没有搜索到相关数据.'
              }
            }
            _self.skip += res.data.length
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
      loadMore(index, done) {
        if (this.isLoading == false) {
          console.log('-=loadMore=--')
          this.getApi()
        }
        done()
      },
      add() {
        this.$router.push({
          path: '/ticket/new'
        })
      },
      getDetail(id) {
        this.$router.push({
          path: '/ticket/' + id
        })
      }
    },
    destroyed: function () {
      this.clear() // 置空ticket-vuex      
      console.log("已销毁");
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
