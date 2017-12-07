
var onReceiveNotification = function(event) {
  try {
    var content;
    if (window.Platform == "android") {
      content = event.alert;
    } else {
      content = event.aps.alert;
    }
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
