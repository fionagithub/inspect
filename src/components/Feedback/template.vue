<template>
  <q-layout>
    <div slot="header" class="toolbar">
        <button class="head_goback" @click="$router.go(-1)">
          <i>arrow_back</i>
        </button> 
        <q-toolbar-title :padding="1">
          反馈 
        </q-toolbar-title>
      </div>
    <div class="layout-view" >
      <div class="layout-padding ">
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">我要反馈:</div>
            <textarea class="full-width new-desc" v-model='description'> </textarea>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->
        <div class="add-btn">
          <button class="teal full-width" @click='add()'>提交</button>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import {
    required,
    minLength
  } from 'vuelidate/lib/validators'
  import {Toast} from 'quasar'
  export default {
    name: "new",
    data() {
      return {
           description:''
      }
    }, 
    computed:{
      ...mapState('auth',['user'])
    },
    methods: { 
      ...mapActions('feedback', {
        createMessages: 'create',
      }),
      add() {
        console.log(this.user)
        let data = {
          "_tanent":  this.user._tenantId,
          "username": this.user.name,
          "userid": this.user.id,
          "content": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            this.$router.push({path:'/'})
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            console.log('-=:[]', error)
            let tips =error.code==401? '认证失败，请重新登录': '哦,服务崩溃，稍后再试'
            Toast.create.negative({
              html: tips ,
              timeout: 3000
            })
          })
      }
    },
    plugins: ['vuelidate'], 
    destroyed: function () {
      console.log("已销毁");
    },
    validations: {
      description: {
        required,
        minLength: minLength(4)
      }
    }
  }
</script>
<style>
  .add-btn {
    margin-top: 50px;
  }

  .new-desc {
    height: 80px;
  }

  .form-group__message {
    display: none;
    font-size: .95rem;
    color: #CC3333;
    margin-left: 10em;
    margin-bottom: 12px;
  }

  .form-group--error+.form-group__message {
    display: block;
    color: #CC3333;
  }
</style>
