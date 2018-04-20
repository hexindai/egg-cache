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

基于 [cache-manager](https://github.com/BryanDonovan/node-cache-manager)

通过简单的配置就可以直接使用基于 [cache-manager](https://github.com/BryanDonovan/node-cache-manager) 开发的 store
* [支持的 Store 列表](https://github.com/BryanDonovan/node-cache-manager#store-engines)
* [配置参考](#添加-store)

## 安装

```sh
npm i egg-cache --save
```

或

```sh
yarn add egg-cache
```

## 配置

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
## 使用

```js
await app.cache.set('foo', 'bar', 60, { foo: 'bar' });

await app.cache.get('foo'); // 'bar'

await app.cache.has('foo'); // true

await app.cache.del('foo');
await app.cache.get('foo', 'default');  // 'default'

await app.cache.has('foo'); // false

// 使用闭包
await app.cache.set('foo', () => {
  return 'bar';
}); // 'bar'

// 异步结果
await app.cache.set('foo', () => {
  return Promise.resolve('bar');
});  // 'bar'

// 获取缓存，如果不存在则使用闭包中的结果生成，这在很多日常需求中十分有效
await app.cache.get('foo', () => {
  return 'bar';
}); // 'bar'

// 和 set 一样，你也可以指定有效期和一些选项
await app.cache.get('foo', () => {
  return 'bar';
}, 60, {
  foo: 'bar'
});

//  foo 已被缓存
await app.cache.get('foo'); // 'bar'
```

### 添加 Store

使用基于 `redis` 的 store ：

1. 配置中，`store` 都使用 `driver` 代替，其它的配置不变

```js
// config/config.default.js

const redisStore = require('cache-manager-ioredis');

exports.cache = {
  default: 'memory',
  stores: {
    memory: {
      driver: 'memory',
      max: 100,
      ttl: 0,
    },
    redis: { // 配置参考: https://github.com/dabroek/node-cache-manager-ioredis#single-store
      driver: redisStore,
      host: 'localhost',
      port: 6379,
      password: '',
      db: 0,
      ttl: 600,
      valid: _ => _ !== null,
    },
  },
};
```

2. 使用

```js
const store = app.cache.store('redis');

await store.set('foo', 'bar');
await store.get('foo'); // 'bar'

await store.del('foo');
await store.has('foo'); // false
```

### Api

#### cache.set(name, value, [expire=null, options=null]);

设置缓存
 - `name` 缓存名称
 - `value` 缓存值
 - `expire` (可选) 有效期（默认会取相关 store 的配置，单位：秒， `0` 为永不过期）
 - `options` (可选) 配置（memory store 参考：[cache-manager 的源码](https://github.com/BryanDonovan/node-cache-manager/blob/master/lib/stores/memory.js#L14-L18))

#### cache.get(name, [defaultValue=null, expire=null, options=null]);

获取缓存
 - `name` 缓存名称
 - `defaultValue` (可选) 默认值
 - `expire` (可选) 有效期（当 `defaultValue` 是一个函数时有效，同 `set`）
 - `options` (可选) 配置（当 `defaultValue` 是一个函数时有效，同 `set`）

#### cache.del(name);

删除缓存
 - `name` 缓存名称

#### cache.has(name);

缓存是否存在
 - `name` 缓存名称

#### cache.store(name, [options=null]);

获取自定义 store
 - `name` Store 名称

#### cache.reset();

清空缓存

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

```sh
npm test
```

## 提问交流

请到 [Issues](https://github.com/hexindai/egg-cache/issues) 交流。

## License

[MIT](https://github.com/hexindai/egg-cache/LICENSE)
