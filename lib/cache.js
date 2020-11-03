'use strict';

const Store = require('./store');
const manager = require('cache-manager');
const pro = require('process');
const drivers = Object.create(null);

module.exports = app => {

  const { default: defaultStore, stores } = app.config.cache;

  if (stores === null) {
    throw new Error('The config `stores` cannot be null.');
  }

  if (typeof stores !== 'object' || !stores[defaultStore]) {
    throw new Error(`Store ${defaultStore} is not support.`);
  }

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

  const syncKey = ( stores.memory && stores.memory.syncKey ) ? stores.memory.syncKey : 'cacheSync';

  return {
    store,
    set: (...args) => {
      let argsT = args;
      if( defaultStore === 'memory' ) {
        if(typeof(args[0]) === 'string'){
          app.messenger.sendToApp(syncKey, { act: 1, pid: pro.pid, args: args });
        } else {
          argsT = args[0].args;
        }
      } 
      return store(defaultStore).set(...argsT);      
    },
    get: (...args) => {
      return store(defaultStore).get(...args);
    },
    del: (...args) => {
      let argsT = args;
      if( defaultStore === 'memory' ) {
        if( typeof(args[0]) === 'string' ) {
          app.messenger.sendToApp(syncKey, { act: 0, pid: pro.pid, args: args });
        } else {
          argsT = args[0].args;
        }
      } 
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
