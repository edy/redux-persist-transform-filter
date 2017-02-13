'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createFilter;
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
			var value = (0, _lodash2.default)(state, path);

			if (typeof value !== 'undefined') {
				(0, _lodash4.default)(subset, path, value);
			}
		});
	} else if (transformType === 'blacklist') {
		subset = Object.assign({}, state);
		paths.forEach(function (path) {
			var value = (0, _lodash2.default)(state, path);

			if (typeof value !== 'undefined') {
				(0, _lodash6.default)(subset, path);
			}
		});
	} else {
		subset = state;
	}

	return subset;
}
