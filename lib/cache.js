'use strict';

const Store = require('./store');
const manager = require('cache-manager');

const drivers = Object.create(null);

module.exports = app => {

  const { default: defaultStore, stores } = app.config.cache;

  const store = (name, options = {}) => {
    if (!drivers[name]) {
      const config = stores[name];

      if (!stores[name]) {
        throw new Error(`Store ${name} is not support.`);
      }

      options = Object.assign({
        store: config.driver,
        valid: _ => _ !== undefined,
      }, stores[name], options);

      const driver = manager.caching(options);

      drivers[name] = new Store(driver, options);
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
    reset: (...args) => {
      return store(defaultStore).reset(...args);
    },
  };
};
