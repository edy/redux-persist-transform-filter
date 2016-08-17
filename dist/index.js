'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.persistFilter = persistFilter;

var _reduxPersist = require('redux-persist');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (reducerName, inboundPaths, outboundPaths) {
	return (0, _reduxPersist.createTransform)(
	// inbound
	function (inboundState, key) {
		return inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState;
	},

	// outbound
	function (outboundState, key) {
		return outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState;
	}, { whitelist: [reducerName] });
};

function persistFilter(state) {
	var paths = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	paths.forEach(function (path) {
		var value = (0, _lodash2.default)(state, path);

		if (typeof value !== 'undefined') {
			(0, _lodash4.default)(subset, path, value);
		}
	});

	return subset;
}
