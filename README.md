# egg-cache

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-cache.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-cache
[travis-image]: https://img.shields.io/travis/hexindai/egg-cache.svg?style=flat-square
[travis-url]: https://travis-ci.org/hexindai/egg-cache
[codecov-image]: https://img.shields.io/codecov/c/github/hexindai/egg-cache.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hexindai/egg-cache?branch=master
[david-image]: https://img.shields.io/david/hexindai/egg-cache.svg?style=flat-square
[david-url]: https://david-dm.org/hexindai/egg-cache
[snyk-image]: https://snyk.io/test/npm/egg-cache/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-cache
[download-image]: https://img.shields.io/npm/dm/egg-cache.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-cache

Based on [cache-manager](https://github.com/BryanDonovan/node-cache-manager)

[中文文档](README.zh_CN.md)

## Installation

```sh
npm i egg-cache -S
```

## Configuration

```js
// config/plugin.js
exports.cache = {
  enable: true,
  package: 'egg-cache',
};
```

```js
// config/config.default.js
exports.cache = {
  default: 'memory',
  stores: {
    memory: {
      driver: 'memory',
      max: 100,
      ttl: 0,
    },
  },
};
```
## Usage

```js
await app.cache.set('name', 'abel', 60, { foo: 'bar' });

await app.cache.get('name'); // 'abel'

await app.cache.has('name'); // true

await app.cache.del('name');
await app.cache.get('name', 'defaultName');  // 'defaultName'

await app.cache.has('name'); // false

// closure
await app.cache.set('name', () => {
  return 'abel';
}); // 'abel'

// Promise
await app.cache.set('name', () => {
  return Promise.resolve('abel');
});  // 'abel'

// Get cached value. If it's not existed, get and save the value from closure
await app.cache.get('name', () => {
  return 'abel';
}); // 'abel'

// You can declare an `expire` option
await app.cache.get('name', () => {
  return 'abel';
}, 60, {
  foo: 'bar'
});

//  name was cached
await app.cache.get('name'); // 'abel'
```

### Store

Currently just support memory

```js
const store = app.cache.store('memory');

await store.set('name', 'abel');
```

### Api

#### cache.set(name, value, [expire=null, options=null]);

Set Cache
 - `name` cache name
 - `value` cache value
 - `expire` (Optional) expire（default from config file，the unit is second， `0` means *nerver* expire）
 - `options` (Optional) Refer to [cache-manager](https://github.com/BryanDonovan/node-cache-manager/blob/master/lib/stores/memory.js#L14-L18))

#### cache.get(name, [defaultValue=null, expire=null, options=null]);

#### cache.del(name);

#### cache.has(name);

#### cache.store(name, [options=null]);

## Default configuration

Refer to [config/config.default.js](config/config.default.js)

## Unit Test

```sh
npm test
```

## Issue

Refer to [Issues](https://github.com/hexindai/egg-cache/issues).

## License

[MIT](LICENSE)
