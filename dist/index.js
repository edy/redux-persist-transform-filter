'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createFilter = createFilter;
exports.createWhitelistFilter = createWhitelistFilter;
exports.createBlacklistFilter = createBlacklistFilter;
exports.persistFilter = persistFilter;

var _reduxPersist = require('redux-persist');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.unset');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.pickby');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.isempty');

var _lodash10 = _interopRequireDefault(_lodash9);

var _lodash11 = require('lodash.forin');

var _lodash12 = _interopRequireDefault(_lodash11);

var _lodash13 = require('lodash.clonedeep');

var _lodash14 = _interopRequireDefault(_lodash13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFilter(reducerName, inboundPaths, outboundPaths) {
	var transformType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'whitelist';

	return (0, _reduxPersist.createTransform)(
	// inbound
	function (inboundState, key) {
		return inboundPaths ? persistFilter(inboundState, inboundPaths, transformType) : inboundState;
	},

	// outbound
	function (outboundState, key) {
		return outboundPaths ? persistFilter(outboundState, outboundPaths, transformType) : outboundState;
	}, { 'whitelist': [reducerName] });
};

function createWhitelistFilter(reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'whitelist');
}

function createBlacklistFilter(reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'blacklist');
}

function filterObject(_ref, state) {
	var path = _ref.path,
	    _ref$filterFunction = _ref.filterFunction,
	    filterFunction = _ref$filterFunction === undefined ? function () {
		return true;
	} : _ref$filterFunction;

	var value = (0, _lodash2.default)(state, path);

	if (value instanceof Array) {
		return value.filter(filterFunction);
	}

	return (0, _lodash8.default)(value, filterFunction);
}

function persistFilter(state) {
	var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var transformType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'whitelist';

	var subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	if (transformType === 'whitelist') {
		paths.forEach(function (path) {
			if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && !(path instanceof Array)) {
				var value = filterObject(path, state);

				if (!(0, _lodash10.default)(value)) {
					(0, _lodash4.default)(subset, path.path, value);
				}
			} else {
				var _value = (0, _lodash2.default)(state, path);

				if (typeof _value !== 'undefined') {
					(0, _lodash4.default)(subset, path, _value);
				}
			}
		});
	} else if (transformType === 'blacklist') {
		subset = (0, _lodash14.default)(state);
		paths.forEach(function (path) {
			if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && !(path instanceof Array)) {
				var value = filterObject(path, state);

				if (!(0, _lodash10.default)(value)) {
					if (value instanceof Array) {
						(0, _lodash4.default)(subset, path.path, (0, _lodash2.default)(subset, path.path).filter(function (x) {
							return false;
						}));
					} else {
						(0, _lodash12.default)(value, function (value, key) {
							(0, _lodash6.default)(subset, path.path + '[' + key + ']');
						});
					}
				}
			} else {
				var _value2 = (0, _lodash2.default)(state, path);

				if (typeof _value2 !== 'undefined') {
					(0, _lodash6.default)(subset, path);
				}
			}
		});
	} else {
		subset = state;
	}

	return subset;
}

exports.default = createFilter;
