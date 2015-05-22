#AA Bear Hug Application

##Introduction

This is the first draft of a simple Facebook canvas app that will verify if a user has given their permission for it to access their data. If permission hasn't been given, it will redirect a user to a permission request dialog, and then back to the app. The app will then check if a user has been invited and then redirect the user to a private page.


##Configuration

There are two configuration files inside the [config](config) folder, with specific config parameters:

- [app-config.js](config/app-config.js)
	- privateRedirectUrl: The url for the private page to which the user will be redirected
	- fbAppUrl: The url for the Facebook app
	- fbAppId: The Facebook application ID, currently being taken from the **FB_APP_ID** environment variable
	- fbAppSecret: The Facebook application secret, currently being taken from the **FB_APP_SECRET** environment variable
- [server-config.js](config/server-config.js)
	- address: Set this to a specific IP address to restrict the server to listen on a specific IP
	- port: The port on which the application will listen. Can be specified via the **PORT** environment variable
	- host: Set this to a specific host to limit the hostname on which the app listens. Can be specified via the **APP_HOST** environment variable.

##Templates

The [templates](templates) folder contains HTML templates built with [handlebars](http://handlebarsjs.com/). These can be used to edit the content shown for certain cases. There are three templates currently defined:

- [permission-denied.html](templates/permission-denied.html): The page shown when a user has not granted permission to the app to access their information
- [invited.html](templates/invited.html): The page shown when a user has given permission to the app and has been invited to use the app.
- [not-invited.html](templates/not-invited.html): The page shown when a user has given permission to the app but has not been invited to use the app.


##Special considerations

Facebook canvas apps inject the server responses into an iframe within Facebook, so for all intents and purposes, when the app is viewed from the canvas, your app is running on facebook.com. This means that any attempts to access the DOM from within the iframe will be valid. This also means that, if you want to redirect your user to a certain page outside of Facebook, any redirects need to be done via Javascript, and any HTML links show in a response need to have **target="_top"** set (See the [permission denied template](templates/permission-denied.html) for an example).
