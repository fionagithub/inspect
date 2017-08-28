<template>
    <div class="layout-padding new">
      <p class="caption">例项</p>
      <div class="list">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">设备NO:</div>
            <input class="auto" v-model="deviceNo" v-on:input="$v.deviceNo.$touch" :class="{'has-error': $v.deviceNo.$error}">
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">设备名称:</div>
            <input class="auto" v-on:input="$v.deviceName.$touch" :class="{'has-error': $v.deviceName.$error}" v-model="deviceName">
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">监控类型:</div>
            <q-select class="full-width" type="checkbox" v-model="monitors" :options="selectOptions"></q-select>
          </div>
        </div>
      </div>
      <p class="caption">其他 </p>
      <div class="list">
        <div class="item multiple-lines item-delimiter">
          <div class="item-content">
            <!-- Notice "no-border" CSS class -->
            <input class="full-width no-border" v-model="description">
          </div>
        </div>
      </div>
      <!--<pre>$v: {{ $v }}</pre>-->
      <div class="add-btn">
        <button class="teal full-width" @click="add()" :disabled="$v.$dirty&&$v.$error">提交</button>
      </div>
    </div>
</template>

<script>
  import {
    required,
    sameAs,
    between,
    minLength
  } from 'vuelidate/lib/validators'
  import toolbar from 'components/layout/toolbar.vue'
  import {
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "new",
    data() {
      return {
        name: '',
        deviceNo: "",
        deviceName: "",
        description: "",
        monitors: [],
        selectOptions: [{
            label: '冷凝水箱液位',
            value: '冷凝水箱液位',
          },
          {
            label: '锅炉水位',
            value: '锅炉水位',
          }
        ]
      }
    },
    plugins: ['vuelidate'],
    components: {
      toolbar
    },
    created(){
      this.setBarInfo()
    },
    methods:{
      ...mapMutations(['setBar'] ),
      setBarInfo(){
        this.setBar({
          title:'新增',
          search:false,
          show: {
            bar:true,
            drawer:false,
          },
          direction:'true'
        })
      },
      ...mapActions('message', {
        createMessages: 'create',
      }),
      add() {
        let data = {
          "id": this.deviceNo,
          "deviceName": this.deviceName,
          "deviceNo": this.deviceNo,
          "monitors": this.monitors,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            // console.log('-=-=', res)
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            this.error = error
          })
      }
    },
    validations: {
      deviceNo: {
        required,
        minLength: minLength(2)
      },
      deviceName: {
        required,
        minLength: minLength(2)
      }
    }
  }

</script>
<style>
  .new{
    width: 100%;
  }
  .add-btn {
    margin-top: 50px;
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
