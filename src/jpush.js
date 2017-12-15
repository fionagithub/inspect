var onOpenNotification=function(event) {
  try {
     let content= event.extras; 
     let url='/jpush/'+content.type+'/'+content.id
     window.jpushUri.path=url
    console.log('--open--------', event)
  } catch (exception) {
    console.log("JPushPlugin:onOpenNotification==============" + exception);
  } 
};


document.addEventListener("jpush.openNotification", onOpenNotification, false);
  
//window.issueCount={}

var onReceiveNotification = function(event) {
  try {
    var content;
    // if (window.Platform == "android") {
    //   content = (event.alert);
    // } else {
    //   content = (event.aps.alert);
    // }
    //接收到报警消息时，重新取count this.getTicketCount()
    //window.issueCount.moudle=content.type
    console.log('--receive--------', event)
  } catch (exception) {
    console.log(exception)
  }
};

var onReceiveMessage = function(event) {
  try {
    var message;
    // if (window.Platform == "android") {
    //   message = event.message;
    // } else {
    //   message = event.content;
    // }
    console.log("JPushPlugin:onReceiveMessage-->" + event);
  } catch (exception) {
    console.log("JPushPlugin:onReceiveMessage-->" + exception);
  }                                         
};

document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
