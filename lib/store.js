'use strict';
const pro = require('process');

class Store {
  static syncKey = 'egg-cache:cacheSync'
  constructor(driver, options,app) {
    this.driver = driver;
    this.options = options;
    this.storeName = this.driver.store.name;
    this.app = app;
  }

  async set(name, value, expire = null, options = null) {
    options = Object.assign({}, options, {
      ttl: expire,
    });

    if (typeof value === 'function') {
      value = await value();
    }

    return new Promise((resolve, reject) => {
      this.driver.set(name, value, options, err => {
        if (err) { return reject(err); }

        if( this.storeName === 'memory' && options.isMemSync !== true ){
          options.isMemSync = true;
          this.app.messenger.sendToApp( Store.syncKey, { act: 1, pid: pro.pid, name,value,expire,options });
        }
        resolve(value);
      });
    });
  }

  async get(name, defaultValue = null, expire = null, options = null) {
    const value = await new Promise((resolve, reject) => {
      this.driver.get(name, (err, result) => {
        if (err) { return reject(err); }
        resolve(result);
      });
    });

    if (this.options.valid(value)) {
      return value;
    }

    if (typeof defaultValue === 'function') {
      return this.set(name, defaultValue, expire, options);
    }

    return defaultValue;
  }

  del(name, isMemSync = null) {
    return new Promise((resolve, reject) => {
      this.driver.del(name, err => {
        if (err) { return reject(err); }

        if( this.storeName === 'memory' && !isMemSync ){
          this.app.messenger.sendToApp( Store.syncKey, { act: 0, pid: pro.pid, name, isMemSync: true });
        }
        resolve();
      });
    });
  }

  has(name) {
    return new Promise((resolve, reject) => {
      this.driver.get(name, (err, result) => {
        if (err) { return reject(err); }
        resolve(this.options.valid(result));
      });
    });
  }

  reset() {
    return new Promise((resolve, reject) => {
      this.driver.reset(err => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }
}

module.exports = Store;
