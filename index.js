import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import unset from 'lodash.unset';
import pickBy from 'lodash.pickby';
import isEmpty from 'lodash.isempty';

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

function filterObject({ path, filterFunction = () => true }, state) {
  const value = get(state, path);
  return pickBy(value, filterFunction);
}

export function persistFilter (state, paths = [], transformType = 'whitelist') {
	let subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	if (transformType === 'whitelist') {
		paths.forEach((path) => {
			if (typeof path === 'object') {
				const value = filterObject(path, state);

				if (!isEmpty(value)) {
					set(subset, path.path, value);
				}
			} else {
				const value = get(state, path);

				if (typeof value !== 'undefined') {
					set(subset, path, value);
				}
			}
		});
	} else if (transformType === 'blacklist') {
		subset = Object.assign({}, state);
		paths.forEach((path) => {
			if (typeof path === 'object') {
				const value = filterObject(path, state);

				if (!isEmpty(value)) {
					unset(subset, path.path);
				}
			} else {
				const value = get(state, path);

				if (typeof value !== 'undefined') {
					unset(subset, path);
				}
		}
		});
	} else {
		subset = state;
	}

	return subset;
}
