import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';

export default (reducerName, inboundPaths, outboundPaths) => {
	return createTransform(
		// inbound
		(inboundState, key) => {
			return inboundPaths
				? persistFilter(inboundState, inboundPaths)
				: inboundState;
		},

		// outbound
		(outboundState, key) => {
			return outboundPaths
				? persistFilter(outboundState, outboundPaths)
				: outboundState;
		},

		{whitelist: [reducerName]}
	);
};

export function persistFilter (state, paths = []) {
	const subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	paths.forEach((path) => {
		const value = get(state, path);

		if (typeof value !== 'undefined') {
			set(subset, path, value);
		}
	});

	return subset;
}
