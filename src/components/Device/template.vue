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
          <div class="list item-inset-delimiter no-border " v-if="message.length">
            <div class="item item-link" v-for="(item,index) in message " @click="getDetail(item.id)">
              <i class="item-primary">mail</i>
              <div class="item-content inset">
                <div>
                   {{item.system + `(`+ item.state[0].name+`)` }} 
                <div class="desc" > {{item.description}}
                  </div>
                </div>
              </div>
              <i class="item-secondary">keyboard_arrow_right</i>
            </div>
          </div>

          <div class="row justify-center" style="margin-bottom: 50px;">
            <spinner name="dots" slot="message" :size="40" v-if="fetched">
            </spinner>
            <div slot="message" :size="40" v-else>
              {{tips||"共计"+message.length+"条数据"}}
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
        tips: null,
        //   message: [],
        fetched: true,
        isLoading: true,
        searchModel: '',
        limit: 10,
        _resumed: false,
        skip: 0,
        selectType: '未处理',
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
          value: '未处理',
          label: '未处理'
        }, {
          value: '处理中',
          label: '处理中'
        }, {
          value: '已处理',
          label: '已处理'
        }]
      }
    },
    computed: {
      ...mapGetters('tickets', {
        message: 'list',
      })
    },
    components: {
      toolbar
    },
    created() {
      this.setNavInfo()
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
        this.fetched = true
        this._resumed = this.searchModel !== '' ? true : false
        this.skip = 0
        console.log('-123=', this._resumed)
        this.clear()
        //  this.message = []
        this.$refs.infiniteScroll.resume()
        // this.searchModel="TMqd1504173136754"
      },
      getApi() {
        let _self = this
        _self.tips = null
          let _query = {
            $limit: _self.limit,
            $skip: _self.skip,
          }
            _self.isLoading =true 
          console.log('--==-', _query)
          if (_self._resumed == true) {
            _query = Object.assign(_query, {
              '$or': [{
                description: _self.searchModel
              }]
            })
          }

          _self.findMessages({
              query: _query
            }).then((res) => {
              if (res.data.length == 0) {
                _self.tips = '暂无数据.'
                console.log('-=[sdf]')
                _self.fetched = false
                if (_self._resumed == true) {
                  console.log('-search--=1-')
                  _self.tips = '没有搜索到相关数据.'
                }
              }
              console.log('-=res--', _self.tips, res.data)
              _self.skip += res.data.length
              if (res.data.length < _self.limit) {
                _self.fetched = false
                _self.stopLoading()
              }
              _self.isLoading = false 
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
        //loadmore 数据加载之间的时间间隔
        /* setTimeout(() => {
         }, 2500)*/
         if(this.isLoading==false){
          console.log('-=loadMore=--')
          this.getApi()

         }
        done()

      },
      stopLoading() {
        console.log('-stop=2-') // stop  scroll event
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

 .list-scroll .item-link {
    height: 50px;
    margin-top: 12px;
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
.desc{
  color: #999;
  padding-top: 10px;
  font-size: 14px;
}
.q-popover .item-container{
  height: 38px;
}
</style>
