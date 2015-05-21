'use strict';

var Crypto = require('crypto');

var appConfig = require('../config/app-config');
var invitationChecker = require('./invitation-checker');

var FacebookHandler = module.exports = {};

FacebookHandler.checkLoginStatus = function(request, reply) {
	var payload = request.payload;

	// if (payload) {
	// 	return reply('<pre>' + JSON.stringify(payload, null, 4) + '</pre>');
	// }
	if (!payload || !payload.signed_request) {
		return reply.redirect(appConfig.fbAppUrl);
	} else {
		var signedRequestData = payload.signed_request.split('.');
		var signature = signedRequestData[0].replace(/-/g, '+').replace(/_/g, '/');
		var data = JSON.parse(new Buffer(signedRequestData[1], 'base64').toString());
		var expectedSignature = Crypto.createHmac('sha256', appConfig.fbAppSecret).update(signedRequestData[1]).digest('base64');

		//The signature FB sends doesn't have the padding ='s used by base64, so we'll remove them here too
		expectedSignature = expectedSignature.replace(/=/g, '');

		var permissionDeniedContext = {
			fbAppId: appConfig.fbAppId,
			fbAppUrl: appConfig.fbAppUrl
		};

		if (signature !== expectedSignature) {
			//TODO: What happens if signature is incorrect?
			return reply.view('permission-denied', permissionDeniedContext);
		} else if (!data.oauth_token) {
			return reply.view('permission-denied', permissionDeniedContext);
		} else {
			var fbUserId = data.user_id;

			if (invitationChecker.hasUserBeenInvited(fbUserId)) {
				var invitedContext = {
					redirectUrl: appConfig.privateRedirectUrl
				};
				return reply.view('invited', invitedContext);
			} else {
				return reply.view('not-invited');
			}
		}
	}
};
