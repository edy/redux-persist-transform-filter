import { Iterable, Map } from 'immutable';
import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import isUndefined from 'lodash.isUndefined';


export type returnType = Map<string, any> | {[key: string]: any};

export default (reducerName: string, inboundPaths: string | string[], outboundPaths: string | string[]) => {
    return createTransform(
        (inboundState: any, key: string) => inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState,
        (outboundState: any, key: string) => outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState,
        {whitelist: [reducerName]}
    );
};

export function persistFilter (state: any, paths: string | string[] = []): returnType {
    let iterable: boolean  = Iterable.isIterable(state);
    let subset: returnType = iterable ? Map<string, any>({}) : {};
    
    (_.isString(paths) ? [paths] : <Array<string>>paths).forEach((path: string) => {
        let value = iterable ? state.get(path) : get(state, path);
        if(!isUndefined(value)) {
            iterable ? (subset = (<Map<string, any>>subset).set(path, value)) : set(subset, path, value);
        }
    });

    return subset;
}
