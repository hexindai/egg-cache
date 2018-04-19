'use strict';

const Store = require('./store');
const manager = require('cache-manager');

const drivers = Object.create({});

module.exports = app => {

  const defaultStore = app.config.cache.default;
  const stores = app.config.cache.stores;

  const store = (name, options = null) => {
    if (!drivers[name]) {
      const config = stores[name];

      if (!stores[name]) {
        throw new Error(`Store ${name} is not support.`);
      }

      options = Object.assign({
        store: config.driver,
      }, stores[name], options);

      const driver = manager.caching(options);

      drivers[name] = new Store(driver);
    }

    return drivers[name];
  };

  return {
    store,
    set: (...args) => {
      return store(defaultStore).set(...args);
    },
    get: (...args) => {
      return store(defaultStore).get(...args);
    },
    del: (...args) => {
      return store(defaultStore).del(...args);
    },
    has: (...args) => {
      return store(defaultStore).has(...args);
    },
  };
};
