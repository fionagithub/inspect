<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div class="row gutter wrap justify-stretch content-center text-center">
        <q-search class="full-width" v-model="searchModel" @enter='resumeGet()' placeholder="搜索..."></q-search>
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectType" :options="items_type"></q-select>
        </div>
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
        </div>
      </div>
      <q-infinite-scroll :handler="loadMore" ref="infiniteScroll" :offset="100">
        <div class="list item-inset-delimiter no-border " v-if="message.length">
          <div class="item item-link multiple-lines" v-for="(item,index) in message " @click="getDetail(item.id)">
            <i class="item-primary">mail</i>
            <div class="item-content has-secondary">
              <div>
                {{item.system + `(`+ item.state[0].name+`)` }}
              </div>
              <div class="list-desc">
                {{item.description}}
              </div>
            </div>
            <div class='list-time'>
              {{item._createTime | date}}
            </div>
            <i class="item-secondary icon">keyboard_arrow_right</i>
          </div>
        </div>

        <div class="row justify-center" style="margin-bottom: 50px;">
          <spinner name="dots" slot="message" :size="40" v-if="fetched">
          </spinner>
          <div slot="message" :size="40" v-else> 
              {{tips||"共计"+message.length+"条数据" }}
          </div>
        </div>
      </q-infinite-scroll>
    </div>
    <button class="absolute-bottom-right raised circular teal fix-add" @click="add()"><i class="q-fab-icon">add</i>
      </button>
  </div>
</template>
<script>
  import {
    _list
  } from './data'
  import toolbar from 'components/layout/toolbar.vue'
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
  export default {
    data() { 
      let _dt = {

      }
      return Object.assign(_dt, _list)
    },
    computed: {
      ...mapGetters('tickets', {
        message: 'list',
      }), 
    },
    components: {
      toolbar
    },
    created() {
      this.setNavInfo()
    },
    watch: {
      selectType(c, p) {
        this.clear()
        this.skip = 0
        this.fetched = true
        let _query = {}
        if (c !== 'ALL') {
          _query.state = c
        }
        if (this.searchModel !== '') {
          _query['$or'] = [{
            description: this.searchModel
          }]
        }
        console.log(_query, c, '[]')
        this.getApi(_query)
      }
    },
    mounted() {
      this.getApi() //请求初始数据
    },
    methods: {
      ...mapMutations('tickets', {
        clear: 'clearAll'
      }),
      ...mapActions('tickets', {
        findMessages: 'find',
      }),
      resumeGet() {
        this.clear()
        this.skip = 0
        this.fetched = true
        let _query = {}
        if (this.selectType !== 'ALL') {
          _query['state'] = this.selectType
        }
        if (this.searchModel !== '') {
          _query['$search'] = this.searchModel
        }
        this.getApi(_query)
      },
      getApi(obj) {
        let _self = this
        _self.isLoading = true
        _self.tips = null
        let _query = {
          $limit: _self.limit,
          $skip: _self.skip,
        }
        if (obj) {
          _query = Object.assign(_query, obj)
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
          .catch(err => {
            this.fetched = false
            this.tips = '哦,服务开小差了'
            Toast.create.negative({
              html: '服务崩溃，稍后再试',
              timeout: 500
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
      ...mapMutations(['setNav']),
      setNavInfo() {
        this.setNav({
          title: '报障清单',
          show: {
            bar: true
          },
          popover: '开发中',
          direction: 'true'
        })
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

  /*
  import io from 'socket.io-client'
  const socket=io('http://192.168.123.125:3030')
  socket.emit('message::find', { status: 'read', user: 10 }, (error, data) => {
    console.log('Found all messages', data);
  });*/

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
