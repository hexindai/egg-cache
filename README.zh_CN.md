# egg-cache

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-cache.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-cache
[travis-image]: https://img.shields.io/travis/eggjs/egg-cache.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-cache
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-cache.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-cache?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-cache.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-cache
[snyk-image]: https://snyk.io/test/npm/egg-cache/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-cache
[download-image]: https://img.shields.io/npm/dm/egg-cache.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-cache

基于 [cache-manager](https://github.com/BryanDonovan/node-cache-manager) 开发的可扩展的缓存组件

## 安装

```sh
npm i egg-cache --save

// or

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
await app.cache.set('name', 'abel', 60);

await app.cache.get('name');  // abel

await app.cache.del('name');
await app.cache.get('name', 'defaultName');  // defaultName
```

### Store

暂时只支持 memory，更多的 store 将会以扩展包的形式开发，便于自主选择

```js
const store = app.cache.store('memory');

await store.set('name', 'abel');
```

### Api

#### cache.set(name, value, [expire=null], [options=null]);

设置缓存
 - `name` 缓存名称
 - `value` 缓存值
 - `expire` (可选) 有效期（默认会取相关 store 的配置，单位：秒， `0` 为永不过期）
 - `options` 配置（memory store 参考：[cache-manager 的源码](https://github.com/BryanDonovan/node-cache-manager/blob/master/lib/stores/memory.js#L14-L18))

#### cache.get(name, [defaultValue=null]);

获取缓存
 - `name` 缓存名称
 - `defaultValue` (可选) 默认值

#### cache.del(name);

删除缓存
 - `name` 缓存名称

#### cache.store(name, [options=null]);

获取自定义 store
 - `name` Store 名称

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

```sh
npm test
```

## 提问交流

请到 [Issues](issues) 交流。

## License

[MIT](LICENSE)
