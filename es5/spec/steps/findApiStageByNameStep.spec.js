"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("conan");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _findApiStageByNameStep = require("../../lib/steps/findApiStageByNameStep.js");

var _findApiStageByNameStep2 = _interopRequireDefault(_findApiStageByNameStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("findApiStageByNameStep", function () {
	var getStageSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "getStage",
			value: function getStage(params, callback) {
				getStageSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		getStageSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "name",
				value: function name() {
					return "testApi";
				}
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _findApiStageByNameStep2.default === "undefined" ? "undefined" : _typeof(_findApiStageByNameStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _findApiStageByNameStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getStageSpy.firstCall.args[0].should.eql({
				stageName: parameters.name(),
				restApiId: restApiId
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api stages not found)", function () {
		beforeEach(function () {
			getStageSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 404 });
			});
		});

		it("should not return no error", function (done) {
			(0, _findApiStageByNameStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should not return results", function (done) {
			(0, _findApiStageByNameStep2.default)(conan, context, function (error, result) {
				should.not.exist(result);
				done();
			});
		});
	});

	describe("(api stage found)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { stageName: "testApi" };
			getStageSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return the stage name for that stage", function (done) {
			(0, _findApiStageByNameStep2.default)(conan, context, function (error, result) {
				result.stageName.should.equal(responseData.stageName);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getStageSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _findApiStageByNameStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});