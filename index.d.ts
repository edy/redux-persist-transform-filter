declare module "redux-persist-transform-filter" {

	import { Transform } from "redux-persist";

	type TransformType = 'whitelist' | 'blacklist';

	export function createFilter<State, Raw>(reducerName: string, inboundPaths?: string[], outboundPaths?: string[], transformType?: TransformType): Transform<State, Raw>;
	export function createWhitelistFilter<State, Raw>(reducerName: string, inboundPaths?: string[], outboundPaths?: string[]): Transform<State, Raw>;
	export function createBlacklistFilter<State, Raw>(reducerName: string, inboundPaths?: string[], outboundPaths?: string[]): Transform<State, Raw>;
	export function persistFilter<State, Raw>(state: State, paths: string[] | { path: string, filterFunction: ((item: any) => boolean) }[], transformType: TransformType): Transform<State, Raw>;

	export default createFilter;
}
