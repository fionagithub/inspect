<template>
  <div class="error-page window-height window-width bg-light column items-center">
    <div class="error-code teal flex items-center justify-center">
      <div class="error-card card bg-white column items-center justify-center">
       <spinner color="#2296a5"  name="bars" :size="30"></spinner>
        <p class="text-center group">
          <h5>
            认证中...
          </h5>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  var onOpenNotification = function(event) {
    try {
      var alertContent;
      if (device.platform == "Android") {
        alertContent = event.alert;
      } else {
        alertContent = event.aps.alert;
      }
      console.log("open Notification::::" + alertContent);
    } catch (exception) {
      console.log("JPushPlugin:onOpenNotification" + exception);
    } 
  };

  var onReceiveNotification = function(event) {
    try {
      var alertContent;
      if (device.platform == "Android") {
        alertContent = event.alert;
      } else {
        alertContent = event.aps.alert;
      }
      console.log('--nnn---rrrr-----', alertContent)
    } catch (exception) {
      console.log(exception)
    }
  };

  var onReceiveMessage = function(event) {
    try {
      var message;
      if (device.platform == "Android") {
        message = event.message;
      } else {
        message = event.content;
      }
      console.log("JPushPlugin:onReceiveMessage-->" + message);
    } catch (exception) {
      console.log("JPushPlugin:onReceiveMessage-->" + exception);
    }                                         
  };
import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
export default {
  created(){
    this.setAuth()
  },
  methods: {
    ...mapActions('auth', [
      'authenticate'
    ]),
    setAuth(obj) {
      let _self = this
      _self.authenticate().then((response) => {
        // console.log('--!!!:::exp--')
        _self.$router.push('/index')
         //通知栏打开推送消息
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        //实时接收推送数据
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        //
        document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
      }).catch((error) => {
        //取消jpush消息
        document.removeEventListener("jpush.openNotification", onOpenNotification, false);
        document.removeEventListener("jpush.receiveMessage", onReceiveMessage, false);
        document.removeEventListener("jpush.receiveNotification", onReceiveNotification, false);
         _self.$router.push('/login')
      });
    },
  },
}
</script>

<style lang="stylus">
 .error-code{
    height :50vh;
    width :100%;
    padding-top: 15vh;
    font-size :30vmax;
    color :rgba(255, 255, 255, .2);
    overflow :hidden;
  }
  .error-card{
    margin-top: -25px;
    width: 90vw;
    max-width :600px;
    padding :50px;
  }
    h5{
      color: black;
    }
</style>
