"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = putMethodResponseStep;

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getResponseParameters(responseHeaders) {
	var result = {};
	Object.keys(responseHeaders).forEach(function (responseHeaderName) {
		result["method.response.header." + responseHeaderName] = false;
	});
	return result;
}

function putMethodResponseStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var statusCodes = context.parameters.statusCodes();
	var responseStatusCodes = context.results.responseStatusCodes;
	if (restApiId && resourceId && Array.isArray(responseStatusCodes) && statusCodes) {
		(function () {
			var api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});

			var responseParameters = getResponseParameters(context.parameters.responseHeaders());

			_flowsync2.default.eachSeries(Object.keys(statusCodes), function (statusCode, next) {
				var status = responseStatusCodes.find(function (currentStatusCode) {
					return currentStatusCode === "" + statusCode;
				});
				//if the specified status is new
				if (!status) {
					var apiParameters = {
						restApiId: restApiId,
						resourceId: resourceId,
						httpMethod: context.parameters.method(),
						statusCode: "" + statusCode,
						responseParameters: responseParameters
					};
					api.putMethodResponse(apiParameters, function (error, response) {
						if (response) {
							next();
						} else {
							next(error);
						}
					});
				} else {
					next();
				}
			}, function (error) {
				if (error) {
					done(error);
				} else {
					done(null, {});
				}
			});
		})();
	} else {
		done(null, {});
	}
}