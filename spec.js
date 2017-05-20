import { expect } from 'chai';
import createFilter, { createWhitelistFilter, createBlacklistFilter, persistFilter } from './index';

describe('redux-persist-transform-filter', () => {
	describe('persistFilter', () => {
		it('should be functions', () => {
			expect(persistFilter).to.be.a('function');
		});

		it('should return a subset, given one key', () => {
			expect(persistFilter({a:'a', b:'b', c:'c'}, 'a')).to.deep.equal({a:'a'});
		});

		it('should return a subset, given an array of keys', () => {
			expect(persistFilter({a:'a', b:'b', c:'c'}, ['a'])).to.deep.equal({a:'a'});
			expect(persistFilter({a:'a', b:'b', c:'c'}, ['a', 'b'])).to.deep.equal({a:'a', b:'b'});
		});

		it('should return a subset, given one key path', () => {
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, 'a.b')).to.deep.equal({a: {b:'b'}});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, 'a.c')).to.deep.equal({a: {c:'c'}});
		});

		it('should return a subset, given an array of key paths', () => {
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, ['a.b'])).to.deep.equal({a: {b:'b'}});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, [['a', 'b']])).to.deep.equal({a: {b:'b'}});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, ['a.b', 'a.c'])).to.deep.equal({a: {b:'b', c:'c'}});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, [['a', 'b'], ['a', 'c']])).to.deep.equal({a: {b:'b', c:'c'}});
		});

		it('should return a subset, given an object that contains a path and a filterFunction', () => {
			const store = {a:{'id1':{x:true, b:'b'}, 'id2':{x:true, b:'bb'}, 'id3':{x:false, b:'bbb'}}, d:'d'};
			expect(persistFilter(store, [{ path: 'a', filterFunction: item => item.x }])).to.deep.equal({a:{'id1':{x:true, b:'b'}, 'id2':{x:true, b:'bb'}}});
			expect(persistFilter(store, [{ path: 'a', filterFunction: item => item.b === 'bb' }])).to.deep.equal({a:{'id2':{x:true, b:'bb'}}});
		});
	});

	describe('persistFilter (blacklist)', () => {
		it('should return a subset, given one key', () => {
			expect(persistFilter({a:'a', b:'b', c:'c'}, 'a', 'blacklist')).to.deep.equal({b:'b', c:'c'});
		});

		it('should return a subset, given an array of keys', () => {
			expect(persistFilter({a:'a', b:'b', c:'c'}, ['a'], 'blacklist')).to.deep.equal({b:'b', c:'c'});
			expect(persistFilter({a:'a', b:'b', c:'c'}, ['a', 'b'], 'blacklist')).to.deep.equal({c:'c'});
		});

		it('should return a subset, given one key path', () => {
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, 'a.b', 'blacklist')).to.deep.equal({a: {c:'c'}, d:'d'});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, 'a.c', 'blacklist')).to.deep.equal({a: {b:'b'}, d:'d'});
		});

		it('should return a subset, given an array of key paths', () => {
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, ['a.b'], 'blacklist')).to.deep.equal({a: {c:'c'}, d:'d'});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, [['a', 'b']], 'blacklist')).to.deep.equal({a: {c:'c'}, d:'d'});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, ['a.b', 'a.c'], 'blacklist')).to.deep.equal({a:{}, d:'d'});
			expect(persistFilter({a: {b:'b', c:'c'}, d:'d'}, [['a', 'b'], ['a', 'c']], 'blacklist')).to.deep.equal({a:{}, d:'d'});
		});

		it('should return a subset, given an object that contains a path and a filterFunction', () => {
			const store = {a:{'id1':{x:true, b:'b'}, 'id2':{x:true, b:'bb'}, 'id3':{x:false, b:'bbb'}}, d:'d'};
			expect(persistFilter(JSON.parse(JSON.stringify(store)), [{ path: 'a', filterFunction: item => item.x }], 'blacklist')).to.deep.equal({a:{'id3':{x:false, b:'bbb'}}, d:'d'});
			expect(persistFilter(JSON.parse(JSON.stringify(store)), [{ path: 'a', filterFunction: item => item.b === 'bb' }], 'blacklist')).to.deep.equal({a:{'id1':{x:true, b:'b'}, 'id3':{x:false, b:'bbb'}}, d:'d'});
		});
	});

	describe('createFilter', () => {
		it('should be a functions', () => {
			expect(createFilter).to.be.a('function');
		});

		it('should return an object with in and out functions', () => {
			const myFilter = createFilter('reducerName', 'a.b', 'a.c');
			expect(myFilter).to.be.an('object');
			expect(myFilter).to.have.all.keys(['in', 'out']);
			expect(myFilter.in).to.be.a('function');
			expect(myFilter.out).to.be.a('function');
		});

		it('should save a subset', () => {
			const myFilter = createFilter('reducerName', ['a.b', 'd']);

			// simulates a save
			const result = myFilter.in({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {b:'b'}, d:'d'});
		});

		it('should load a subset', () => {
			const myFilter = createFilter('reducerName', undefined, ['a.b', 'd']);

			// simulates a load
			const result = myFilter.out({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {b:'b'}, d:'d'});
		});
	});

	describe('createWhitelistFilter', () => {
		it('should be a functions', () => {
			expect(createWhitelistFilter).to.be.a('function');
		});

		it('should return an object with in and out functions', () => {
			const myFilter = createWhitelistFilter('reducerName', 'a.b', 'a.c');

			expect(myFilter).to.be.an('object');
			expect(myFilter).to.have.all.keys(['in', 'out']);
			expect(myFilter.in).to.be.a('function');
			expect(myFilter.out).to.be.a('function');
		});

		it('should save a subset', () => {
			const myFilter = createWhitelistFilter('reducerName', ['a.b', 'd']);

			// simulates a save
			const result = myFilter.in({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {b:'b'}, d:'d'});
		});

		it('should load a subset', () => {
			const myFilter = createWhitelistFilter('reducerName', undefined, ['a.b', 'd']);

			// simulates a load
			const result = myFilter.out({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {b:'b'}, d:'d'});
		});
	});

	describe('createBlacklistFilter', () => {
		it('should export functions', () => {
			expect(createBlacklistFilter).to.be.a('function');
		});

		it('should return an object with in and out functions', () => {
			const myFilter = createBlacklistFilter('reducerName', 'a.b', 'a.c');
			expect(myFilter).to.be.an('object');
			expect(myFilter).to.have.all.keys(['in', 'out']);
			expect(myFilter.in).to.be.a('function');
			expect(myFilter.out).to.be.a('function');
		});

		it('should save a subset', () => {
			const myFilter = createBlacklistFilter('reducerName', ['a.b', 'd']);

			// simulates a save
			const result = myFilter.in({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {c:'c'}});
		});

		it('should load a subset', () => {
			const myFilter = createBlacklistFilter('reducerName', undefined, ['a.b', 'd']);

			// simulates a load
			const result = myFilter.out({a: {b:'b', c:'c'}, d:'d'}, 'reducerName');

			expect(result).to.deep.equal({a: {c:'c'}});
		});
	});
});
