<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="goback()">
          <i>arrow_back</i>
        </button>
      <q-toolbar-title :padding="1">
        反馈
      </q-toolbar-title>
    </div>
    <div class="layout-view">
      <div class="layout-padding ">
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">我要反馈:</div>
            <textarea class="full-width new-desc" v-model='description'> </textarea>
            <div class="form-group--error" v-if="!$v.description.minLength">至少{{ $v.description.$params.minLength.min }}位...</div>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->
        <div class="add-btn">
          <q-progress-button :disabled="unAddBtn" :percentage="progressBtn" @click.native="add()" indeterminate class="teal full-width">
            提交
          </q-progress-button>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  import {
    required,
    minLength
  } from 'vuelidate/lib/validators'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "new",
    data() {
      return {
        flag: false,
        progressBtn:0,
        description: '',
      }
    },
    computed: {
      ...mapGetters(['getGlbErr']),
      ...mapState('auth', ['user']),
      unAddBtn() {
        let _disabled
        if (this.getGlbErr.isFlag == false) {
          if (this.flag == true) {
            _disabled = true
          } else {
            _disabled= this.description.length<4 ?true:false
          }
        } else {
           this.progressBtn=0
            _disabled= this.description.length<4 ?true:false
        }
        return _disabled
      },
    },
    methods: {
      ...mapActions('feedback', {
        createMessages: 'create',
      }),
      goback() {
        this.$router.push({
          path: '/'
        })
      },
      add() {
        this.progressBtn=1
        this.flag = true
        // console.log(this.user)
        let data = {
          _tenantId: this.user._tenantId,
          "username": this.user.name,
          _userId: this.user.id,
          "content": this.description,
        }
        this.createMessages(data)
          .then(res => {
            this.flag = false
            this.progressBtn=0
            Toast.create('提交成功.')
            this.$router.push({
              path: '/'
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
