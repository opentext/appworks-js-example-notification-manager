# AppWorks Example - AWNotificationManager

## Contents
1. [About appworks.js](#about-appworksjs)
2. [About this example app](#about-this-example)
3. [Usage](#usage)
4. [Installation](#installation)

## About appworks.js

appworks.js is a javascript (TypeScript) library for building feature rich, hybrid enterprise apps. The OpenText AppWorks platform provides mobile and desktop clients that support apps that utilize appworks.js.

In a mobile environment the library provides access to on-device technology, and in the desktop environment some features of the underlying host OS (operating system) are exposed.

For more information, see the appworks.js repository: https://github.com/opentext/appworks-js

## About this example

The purpose of the Notifications plugin is to provide a set of methods which allows an app to work with notifications within the AppWorks client. You can set your app up to receive notifications automatically whilst running, request all notifications, get the notification which your app was opened with and delete notifications.

## Usage

#### enablePushNotifications

```javascript
enablePushNotifications(successHandler: any, errorHandler: any, includeSeqNo: boolean)
```

This allows your app to receive notifications automatically whilst it is running without the user having to tap on it from the notifications page.

+ __successHandler__: a callback function that will be passed a new notification in real-time once it reaches the client.
+ __errorHandler__: a function to get executed if there is an error in processing a notification
+ __includeSeqNo__:
 + false: notification message (string) will be returned
 + true: notification message (string), seqno (string), title (string) and body (string) will be returned as object

Examples
```javascript
var self = this;
self.notificationManager = new Appworks.AWNotificationManager();

// Call enablePushNotifications and register success and error handlers for receiving notifications automatically
self.notificationManager.enablePushNotifications(
  function (notification) {
    // real-time notifications will appear here
    alert(JSON.stringify(notification));
  },
  function (error) {
    // Error string will appear here
    alert(error);
  },
  true
);
```

#### disablePushNotifications

```javascript
disablePushNotifications()
```

This stops your app from receiving notifications automatically if it was previously enabled using enablePushNotifications();

Examples
```javascript
// Using the same AWNotificationManager instance as in the enablePushNotifications() example

// Call disablePushNotifications to stop receiving notifications automatically
self.notificationManager.disablePushNotifications();
```

#### getNotifications

```javascript
getNotifications(successHandler: any, errorHandler: any, includeSeqNo: boolean)
```

You can request an array of all notifications from AppWorks which target your app.

+ __successHandler__: a callback function that will be passed an array of all notifications for this app.
+ __errorHandler__: a function to get executed if there is an error in processing notifications.
+ __includeSeqNo__:
 + false: notification message (string) will be returned
 + true: notification message (string), seqno (string), title (string) and body (string) will be returned as object

Examples
```javascript
var self = this;
self.notificationManager = new Appworks.AWNotificationManager();

self.notificationManager.getNotifications(
  function (notifications) {
    // An array of notifications will be returned here
    for(var i = 0; i<notifications.length; i++) {
      console.log(notifications[i]);
    }
  },
  function (error) {
    // Error string will be returned here
    alert(error);
  },
  true
);
```

#### getOpeningNotification

```javascript
getOpeningNotification(successHandler: any, errorHandler: any, includeSeqNo: boolean)
```

You can request an the notification which was used to open your app.

+ __successHandler__: a callback function that will be passed the notification which was used to open the app.
+ __errorHandler__: a function to get executed if there is an error in processing the notification or if there is no opening notification.
+ __includeSeqNo__:
 + false: notification message (string) will be returned
 + true: notification message (string), seqno (string), title (string) and body (string) will be returned as object

Examples
```javascript
var self = this;
self.notificationManager = new Appworks.AWNotificationManager();

self.notificationManager.getOpeningNotification(
  function (notification) {
    // Opening notification will be returned here
    alert(JSON.stringify(notification));
  },
  function (error) {
    // Error string will be returned here
    alert(error);
  },
  true
);
```

#### openListener

```javascript
openListener(successHandler: any, includeSeqNo: boolean)
```

This allows your app to receive notifications when the user taps it in the appworks notification page (opened from the side menu) whilst it is running.

+ __successHandler__: a callback function that will be passed a notification when it is tapped.
+ __includeSeqNo__:
 + false: notification message (string) will be returned
 + true: notification message (string), seqno (string), title (string) and body (string) will be returned as object

Examples
```javascript
var self = this;
self.notificationManager = new Appworks.AWNotificationManager();

self.notificationManager.openListener(
  function (notification) {
    // real-time notifications will appear here
    alert(JSON.stringify(notification));
  },
  true
);
```

#### removeNotification

```javascript
removeNotification(seqno: string, successHandler: any, errorHandler: any)
```

This allows your app to receive notifications when the user taps it in the appworks notification page (opened from the side menu) whilst it is running.

+ __successHandler__: a callback function called when the notification is successfully deleted
+ __errorHandler__: a callback function called when the notification fails to be deleted

Examples
```javascript
var self = this;
self.notificationManager = new Appworks.AWNotificationManager();

self.notificationManager.removeNotification(
  seqno,
  function () {
    // real-time notifications will appear here
    alert("Notification deleted");
  },
  function (error) {
    // Error string will be returned here
    alert(error);
  }
);
```

## Installation

This example app contains 3 important objects:
1. app.properties
2. icon.png
3. mobile.zip

#### app.properties
This files defines the app, with the following properties:
+ __displayName__: The display name of the app
+ __description__: A description of the app
+ __version__: The version of the app, e.g. 0.0.1 or 3.4.5 etc
+ __type__: This can be either app or desktop, or both (app,desktop)
+ __awgPlatformVersion__: The target appworks platform, this should be 16
+ __isAvailableOffline__: Allow this app to be used offline, can be true or false

#### icon.png
An icon that represents the app. This will appear in the gateway and on the device. 48x48px is ideal.

#### mobile.zip

This is your web content, such as html, js, css, images and any other assets.
The only essential file in your mobile.zip is index.html, which will be loaded by the appworks webview. Any other files or structure is up to the developer.

##### index.html

When your app is downloaded and installed in an appworks client, the client will place appworks.js, cordova.js and the cordova plugins in the root of your app.

In your html file, please include the following tags before any other javascript tags:

```html
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="appworks.js"></script>
```

#### Zipping and Deploying
1. Zip up the web content into a file named mobile.zip
2. Zip up the following files:
  + app.properties
  + icon.png
  + mobile.zip
3. Name this file in the format:
  + AppName_Version.zip
  + e.g. MyGreatApp_0.0.1.zip
  + __The version number in the filename must match the version number in app.properties__
4. Install the app on the gateway
  + Go to your gateway in a browser
  + sign in
  + go to app installation tab
  + drag and drop MyGreatApp_0.0.1.zip into the box.
  + Once fully deployed, enable the app.
