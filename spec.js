import { expect } from 'chai';

import createFilter, { persistFilter } from './';

describe('redux-persist-transform-filter', () => {
	describe('persistFilter', () => {
		it('should export functions', () => {
			expect(createFilter).to.be.a('function');
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
	});

	describe('createFilter', () => {
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
});
