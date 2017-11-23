// When setting up a notification callback, e.g. for enablePushNotifications(), the general format is:
//
// AWNotificationManagerInstance // instance of AWNotificationManagerInstance
//  .enablePushNotifications( // The method being called
//    successFunction(notification), // The success function returned with a notification object
//    errorFunction(error), // The error function called with an error string
//    isObject // A boolean, if true, success function will return a notification object, if false, will return just the notification.message string
//  );
//
// When a notification object is returned via a callback, it's JSON properties will contain:
// {
//  seqno - string, the unique identifier of the notification, e.g. "1234"
//  title - string, the title of the notification, e.g. "MyApp Notification"
//  body - string, the body of the notification, e.g. "You have a new task assigned to you"
//  message - string, a stringified JSON object, e.g. "{\"Some\":\"Data\"}"
// }

// Register the deviceready event, called when cordova/appworks is ready to start working with the appworks API
document.addEventListener("deviceready", onDeviceReady, false);
var self = this;

// A global instances of the Apworks.AWNotificationManager. We only want one.
self.notificationManager = null;

// A global array of notifications, so our app can keep track of them.
self.notifications = [];

/**
 * Called when AppWorks is ready
 */
function onDeviceReady() {
  openListener();
}

/**
 * Enable your app to receive notifications automatically
 * When the client receives a notification and the target is your app, they will be pushed through to the handler set here.
 */
function enablePushNotifications() {
  // Get a reference to the global notification manager
  var nm = getNotificationManager();
  // Call enablePushNotifications and register success and error handlers for receiving notifications automatically
  nm.enablePushNotifications(
    function (notification) {
      // real-time notifications will appear here
      // Add the notification object to your local array
      addNotificationToStack(notification);
      // Write out all notifications to an HTML table
      writeNotificationTable();
    },
    function (error) {
      // real-time notifications will appear here
      out(error);
    },
    true);
}

/**
 * Disable notifications from automaitcally being pushed to your handler
 */
function disablePushNotifications() {
  var nm = getNotificationManager();
  nm.disablePushNotifications();
}

/**
 * Get an array of all notifications which are targeting your app
 */
function getNotifications() {
  var nm = getNotificationManager();
  nm.getNotifications(function(notifications) {
    // Clear the local array
    self.notifications = [];
    // Iterate through each notification in the notifications array and add to the local array
    for(var i = 0; i < notifications.length; i++) {
      addNotificationToStack(notifications[i]);
    }
    // Write out all notifications to an HTML table
    writeNotificationTable();
  },
  function(error) {
    out(error);
  },
  true);
}

/**
 * Get the notification which was tapped to open your app
 */
function getOpeningNotification() {
  var nm = getNotificationManager();
  nm.getOpeningNotification(
    function(notification) {
      // Add the notification object to your local array
      addNotificationToStack(notification);
      // Write out all notifications to an HTML table
      writeNotificationTable();
    },
    function(error) {
      out(error);
    },
    true
  );
}

/**
 * Setup a handler to receive notifications when they are tapped in the appworks notification screen
 */
function openListener() {
  var nm = getNotificationManager();
  nm.openListener(function(notification) {
    // Add the notification object to your local array
    addNotificationToStack(notification);
    // Add the notification object to your local array
    writeNotificationTable();
  },true);
}

/**
 * Remove a notification from appworks by supplying the seqNo (the unique identifyer of the notification)
 */
function removeNotification(seqno) {

  var index = -1;
  for(var i = 0; i < self.notifications.length; i++) {
    if(seqno == self.notifications[i].seqno) {
      index = i;
    }
  }

  // Remov the notification object from your local array
  if(index > -1) {
    self.notifications.splice(index,1);
  }
  // Write out all notifications to an HTML table
  writeNotificationTable();

  var nm = getNotificationManager();
  // Tell appworks to delete the notification by supplying the seqno
  nm.removeNotification(
    seqno,
    function() {
      // success function
      out(seqno + " removed");
    },
    function(error) {
      // error function
      out(error);
    }
  );
}

/**
 * Actions a notification in any way you wish
 */
function actionNotification(seqno) {
  var notification = null;
  // Iterate throught the local notifications array and get the notification which matches the seqno
  for(var i = 0; i < self.notifications.length; i++) {
    if(seqno == self.notifications[i].seqno) {
      notification = self.notifications[i];
    }
  }

  // Parse the notifcation.message into JSON use JSON.parse(notification.message)
  // Then pick off the properties you are expecting and have your app react accordingly
  // For now, we are just alerting the message string
  if(notification != null) {
    alert(notification.message);
  }
}

/**
 * Get the global notification manager instance, we only want one for our app.
 */
function getNotificationManager() {
  if(self.notificationManager == null) {
    self.notificationManager = new Appworks.AWNotificationManager();
  }
  return self.notificationManager;
}

/*
 * A helper method to append a notification object to the notifications array
 */
function addNotificationToStack(notification) {
  if(typeof(notification) == "object") {
    self.notifications.push(notification);
  }
}

/*
 * A helper method to construct a table to display all notifications in the notifications array
 */
function writeNotificationTable() {
  var notification = null;
  var table = "<table id='notification-table' cellpadding=0 cellspacing=0>";
  table += "<thead><tr><th>Notifications</th><th></th></tr></thead>";

  table += "<tbody>";
  var rowClass = "cell-alt-1";

  for(var i = 0; i < self.notifications.length; i++) {
    notification = self.notifications[i];
    rowClass = isEven(i) ? "cell-alt-1" : "cell-alt-2" ;
    table += "<tr class='"+rowClass+"'>";
    table += "<td class='cell-1' onclick='actionNotification(\"" +notification.seqno +"\")'>";
    table += "<div class='notification-title'>" + notification.title + "</div>";
    table += "<div class='notification-body'>" + notification.body + "</div>";
    table += "</td>";
    table += "<td class='cell-2' onclick='removeNotification(\"" +notification.seqno +"\")'>X</td>";
    table += "</tr>";
  }

  table += "</tbody>";

  table += "</table>";
  getObject("notification-wrapper").innerHTML = table;
}

/*
 * A helper function to output messages to the results element
 */
function out(message) {
  console.log(message);
  if(typeof(message) == "object") {
    getObject("result").innerHTML = JSON.stringify(message);
  } else {
    getObject("result").innerHTML = message;
  }
}

/*
 * A helper function to get an element by name
 */
function getObject(name) {
  return document.getElementById(name);
}

function isEven(n) {
   return n % 2 == 0;
}

// Mock data - you can use this to work with locally
/*
var t = setTimeout(function() {
mock();
}, 500);

function mock() {
  self.notifications = [
    {"message":"{\"data\":\"111\"}", "title":"test title 1", "body":"test body 1", "seqno":"123"},
    {"message":"{\"data\":\"222\"}", "title":"test title 2", "body":"test body 2", "seqno":"223"},
    {"message":"{\"data\":\"333\"}", "title":"test title 3", "body":"test body 3", "seqno":"323"},
    {"message":"{\"data\":\"444\"}", "title":"test title 4", "body":"test body 4", "seqno":"423"},
  ];

  writeNotificationTable();
}
*/
