<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button> 
      <q-toolbar-title :padding="1">
        设备清单 
      </q-toolbar-title>
      <popover></popover>
    </div> 
    <div slot="header" class="toolbar">
      <q-search class="full-width" disable v-model="searchModel" @enter='searchKey()' placeholder="搜索..."></q-search>
    </div>
    <div class="layout-view">
      <div class="layout-padding">
        <a class="animate-pop refresh-message" v-if="dv_count" @click='getNewMsg()' >
          <span>+{{ dv_count }} </span>  
        </a>
        <q-infinite-scroll :handler="loadMore" ref="infiniteScroll" :offset="100">
          <div class="list item-inset-delimiter no-border " v-if="message">
            <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
              <i class="item-primary">mail</i>
              <div class="item-content has-secondary">
                <div>
                  {{item.name }}
                </div>
                <div class="list-desc">
                  {{item.location.building+"|"+item.location.floor+"|"+item.location.room}}
                </div>
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
                <span>  {{tips}} </span>
              </div>
              <div v-else>
                {{"共计"+message.length+"条数据" }}
              </div>
            </div>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
  </q-layout>
</template>
<script>
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
  import popover from '../layout/popover'
  export default {
    name:'list',
    data() { 
      let _dt = {
        Islogined:false

      }
      return Object.assign(_dt, _list)
    },
    computed: {
      ...mapGetters('devices', {
        message: 'list',
      }), 
      ...mapState(['dv_count'])
    },
    components: {
      popover
    },
    created() {
      feathers.service('devices').on('patched', res => {
        console.log('--!!!!!!!!!!==', res)
        this.ptdDV(res)
      })
    },
    watch: {
      searchModel(c, o){
        if (c==''){
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
          this.$store.state.dv_count += 1
          console.log('rrrr', this.$store.state.dv_count, res)
          this.filterDV([res])
        });
      }
      )
    },
    methods: {
      getNewMsg(){
        this.$store.state.dv_count = 0
        this.clear()
        this.skip = 0
        this.getApi() //请求初始数据 
      },
      ...mapMutations('devices', {
        ptdDV:'updateItem'
      }),
      ...mapActions('devices', {
        clear: 'clearAll',
      }),
      ...mapMutations('devices', {
        filterDV: 'removeItems',
      }),
      ...mapActions('devices', {
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
          $select: ['location', 'name', 'id']
        }
        if (_self.searchModel!== '' ) {
          _query['$search'] = _self.searchModel
        } 
          _query['$skip'] = _self.skip
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
            this.Islogined=error.code==401?true:false
            this.tips =error.code==401? '认证失败，请重新登录': '哦,服务崩溃，稍后再试'
            Toast.create.negative({
              html: '服务崩溃，稍后再试',
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
      getDetail(id) {
        this.$router.push({
          path: '/device/' + id
        })
      }
    },
    destroyed: function () {
     // this.clear() // 置空ticket-vuex      
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
