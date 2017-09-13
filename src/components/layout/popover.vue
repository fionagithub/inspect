<template>
  <button class="right-drawer-opener"><i>more_vert</i>
          <q-popover ref="popover" anchor="top left" self="bottom left" class="bg-white text-black">
            <div class="list highlight ">
              <div class="item">
                <button class="defalut" @click="alert()"> 开发中</button>
  </div>
  </div>
  </q-popover>
  </button>
</template>
<script type="text/javascript">
  import {
    Dialog
  } from 'quasar'
  export default {
    name: "popover",
    methods: {
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
  }

</script>
