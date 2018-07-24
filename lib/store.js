'use strict';

class Store {

  constructor(driver, options) {
    this.driver = driver;
    this.options = options;
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

  del(name) {
    return new Promise((resolve, reject) => {
      this.driver.del(name, err => {
        if (err) { return reject(err); }
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
