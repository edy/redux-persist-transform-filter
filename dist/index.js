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

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _unset = require('lodash/unset');

var _unset2 = _interopRequireDefault(_unset);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _forIn = require('lodash/forIn');

var _forIn2 = _interopRequireDefault(_forIn);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

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

	var value = (0, _get2.default)(state, path, state);

	if (value instanceof Array) {
		return value.filter(filterFunction);
	}

	return (0, _pickBy2.default)(value, filterFunction);
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

				if (!(0, _isEmpty2.default)(value)) {
					(0, _set2.default)(subset, path.path, value);
				}
			} else {
				var _value = (0, _get2.default)(state, path);

				if (typeof _value !== 'undefined') {
					(0, _set2.default)(subset, path, _value);
				}
			}
		});
	} else if (transformType === 'blacklist') {
		subset = (0, _cloneDeep2.default)(state);
		paths.forEach(function (path) {
			if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && !(path instanceof Array)) {
				var value = filterObject(path, state);

				if (!(0, _isEmpty2.default)(value)) {
					if (value instanceof Array) {
						(0, _set2.default)(subset, path.path, (0, _get2.default)(subset, path.path, subset).filter(function (x) {
							return false;
						}));
					} else {
						(0, _forIn2.default)(value, function (value, key) {
							(0, _unset2.default)(subset, path.path + '[' + key + ']');
						});
					}
				} else {
					subset = value;
				}
			} else {
				var _value2 = (0, _get2.default)(state, path);

				if (typeof _value2 !== 'undefined') {
					(0, _unset2.default)(subset, path);
				}
			}
		});
	} else {
		subset = state;
	}

	return subset;
}

exports.default = createFilter;
