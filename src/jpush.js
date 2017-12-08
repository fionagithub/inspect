var onOpenNotification=function(event) {
  try {
    let content;
    if (window.Platform == "android") {
      content = JSON.parse(event.alert);
    } else {
      content = JSON.parse(event.aps.alert);
    }
    let url='/jpush/'+content.type+'/'+content.id
    window.jpushUri.path=url
    
  } catch (exception) {
    console.log("JPushPlugin:onOpenNotification==============" + exception);
  } 
};

document.addEventListener("jpush.openNotification", onOpenNotification, false);
  
//window.issueCount={}

var onReceiveNotification = function(event) {
  try {
    var content;
    if (window.Platform == "android") {
      content = JSON.parse(event.alert);
    } else {
      content = JSON.parse(event.aps.alert);
    }
    //接收到报警消息时，重新取count this.getTicketCount()
    //window.issueCount.moudle=content.type
    console.log('--nnn---rrrr-----', content)
  } catch (exception) {
    console.log(exception)
  }
};

var onReceiveMessage = function(event) {
  try {
    var message;
    if (window.Platform == "android") {
      message = event.message;
    } else {
      message = event.content;
    }
    console.log("JPushPlugin:onReceiveMessage-->" + message);
  } catch (exception) {
    console.log("JPushPlugin:onReceiveMessage-->" + exception);
  }                                         
};

document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
