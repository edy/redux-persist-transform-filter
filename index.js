import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import unset from 'lodash.unset';

export default function createFilter (reducerName, inboundPaths, outboundPaths, transformType = 'whitelist') {
	return createTransform(
		// inbound
		(inboundState, key) => {
			return inboundPaths
				? persistFilter(inboundState, inboundPaths, transformType)
				: inboundState;
		},

		// outbound
		(outboundState, key) => {
			return outboundPaths
				? persistFilter(outboundState, outboundPaths, transformType)
				: outboundState;
		},

		{'whitelist': [reducerName]}
	);
};

export function createWhitelistFilter (reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'whitelist');
}

export function createBlacklistFilter (reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'blacklist');
}

export function persistFilter (state, paths = [], transformType = 'whitelist') {
	let subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	if (transformType === 'whitelist') {
		paths.forEach((path) => {
			const value = get(state, path);

			if (typeof value !== 'undefined') {
				set(subset, path, value);
			}
		});
	} else if (transformType === 'blacklist') {
		subset = Object.assign({}, state);
		paths.forEach((path) => {
			const value = get(state, path);

			if (typeof value !== 'undefined') {
				unset(subset, path);
			}
		});
	} else {
		subset = state;
	}

	return subset;
}
