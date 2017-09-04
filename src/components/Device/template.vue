<template>
  <div class="layout-view">
    <div class="layout-padding layout-device">
      <div class="list-bar">
        <div class="row gutter wrap justify-stretch content-center text-center">
          <q-search class="full-width" v-model="searchModel" @enter='resumeGet()'></q-search>
          <div class="auto">
            <q-select class=" list-btn" type="list" v-model="selectType" :options="items_type"></q-select>
          </div>
          <div class="auto">
            <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
          </div>
        </div>
      </div>
      <div class="list-scroll">
        <q-infinite-scroll :handler="loadMore" ref="infiniteScroll" :offset="100">
          <div class="list item-inset-delimiter" v-if="message.length">
            <div class="item item-link" v-for="(item,index) in message " @click="getDetail(item.ticketId)">
              <i class="item-primary">mail</i>
              <div class="item-content inset">
                {{item.ticketId}} {{item.system}} {{item.state.time}}
              </div>
              <i class="item-secondary">keyboard_arrow_right</i>
            </div>
          </div>

          <div class="row justify-center" style="margin-bottom: 50px;">
            <spinner name="dots" slot="message" :size="40" v-if="fetched">
            </spinner>
            <div slot="message" :size="40" v-else>
              {{tips}}
            </div>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
    <button class="absolute-bottom-right circular teal" style="right: 18px; bottom: 18px;" @click="add()"><i class="q-fab-icon">add</i>
      </button>
  </div>
</template>
<script>
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
      return {
        tips: '',
        message: [],
        fetched: true,
        searchModel: '',
        limit: 10,
        _resumed: false,
        skip: 0,
        selectType: 'NONE',
        selectTime: 'NOW',
        btnFlag: false,
        items_time: [{
          value: 'NOW',
          label: '今日'
        }, {
          value: 'WEEK',
          label: '本周'
        }, {
          value: 'ALL',
          label: '所有'
        }],
        items_type: [{
          value: 'FINISHED',
          label: '已处理'
        }, {
          value: 'NONE',
          label: '未处理'
        }, {
          value: 'PENDING',
          label: '处理中'
        }]
      }
    },
    computed: {
      /* ...mapGetters('tickets', {
         message: 'list',
       })*/
    },
    components: {
      toolbar
    },
    created() {
      this.setNavInfo()
      this.findMessages()
        .catch(err => {
          this.fetched = false
          this.tips = '哦,服务开小差了'
          Toast.create.negative({
            html: '服务崩溃，稍后再试',
            timeout: 500
          })
        })
    },
    mounted() {
      this.clear() // 置空ticket-vuex
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
        this.fetched = true
        this._resumed = true
        this.skip = 0
        this.clear()
        this.message = []
        this.$refs.infiniteScroll.resume()
        // this.searchModel="TMqd1504173136754"
      },
      getApi() {
        let _self = this
        let _query = {
          $limit: _self.limit,
          $skip: _self.skip,
        }
          console.log('--==-', _query)
        if (_self._resumed == true && _self.searchModel !== '') {
          _query = Object.assign(_query, {
            '$or': [{
              ticketId: _self.searchModel
            }]
          })
        }
        _self.findMessages({
          query: _query
        }).then((res) => {
          if (res.data.length == 0) {
            _self.tips = '暂无数据.'
            _self.fetched = false
            if (_self._resumed == true && _self.searchModel !== '') {
              console.log('-search--=1-')
              _self.tips = '没有搜索到相关数据.'
            }
          } else {
            _self.message = _self.message.concat(res.data)
          }
          _self.skip = _self.message.length
        console.log('-=res--', res.data)
          if (res.data.length < _self.limit) {
            _self.fetched = false
            _self.stopLoading()
          }
          let count = 0
          count =_self.message.length
        console.log('-=count=--',count )
          _self.tips = '共计' + count + '条数据'
        })
      },
      loadMore(index, done) {
        //loadmore 数据加载之间的时间间隔
        setTimeout(()=> {
        console.log('-=loadMore=--')
        this.getApi()
          done()

        }, 2500);
      },
      stopLoading() {
        console.log('-stop=2-')// stop  scroll event
        this.$refs.infiniteScroll.stop()
      },
      ...mapMutations(['setNav']),
      setNavInfo() {
        this.setNav({
          title: '报障清单',
          search: true,
          show: {
            bar: true
          },
          direction: 'true'
        })
      },
      add() {
        this.$router.push({
          path: '/device/new'
        })
      },
      getDetail(id) {
        this.$router.push({
          path: '/device/' + id
        })
      }
    }
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

  .item-link {
    height: 80px;
  }

  .layout-device {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .list-bar {
    flex: 1;
  }

  .list-scroll {
    flex: 3;
  }

</style>
