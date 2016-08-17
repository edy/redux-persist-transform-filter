# redux-persist-transform-filter

[![npm](https://img.shields.io/npm/v/redux-persist-transform-filter.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/redux-persist-transform-filter)
[![Travis](https://img.shields.io/travis/edy/redux-persist-transform-filter.svg?maxAge=2592000&style=flat-square)]()

Filter transformator for redux-persist

## Installation
```
  npm install redux-persist-transform-filter
```
## Usage

```js
import createFilter from 'redux-persist-transform-filter';

// you want to store only a subset of your state of reducer one
const saveSubsetFilter = createFilter(
  'myReducerOne',
  ['keyYouWantToSave1', 'keyYouWantToSave2']
);

// you want to load only a subset of your state of reducer two
const loadSubsetFilter = createFilter(
  'myReducerTwo',
  null,
  ['keyYouWantToLoad1', 'keyYouWantToLoad2']
);

// saving a subset and loading a different subset is possible
// but doesn't make much sense because you'd load an empty state
const saveAndloadSubsetFilter = createFilter(
  'myReducerThree',
  ['one', 'two']
  ['three', 'four']
);

persistStore(store, {
  transforms: [
    saveSubsetFilter,
    loadSubsetFilter,
    saveAndloadSubsetFilter,
  ]
});
```
