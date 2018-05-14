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

    return this.driver.set(name, value, options);
  }

  get(name, defaultValue = null, expire = null, options = null) {
    return this.driver.get(name).then(value => {
      if (this.options.valid(value)) {
        return value;
      }

      if (typeof defaultValue === 'function') {
        return this.set(name, defaultValue, expire, options);
      }

      return defaultValue;
    });
  }

  del(name) {
    return this.driver.del(name);
  }

  has(name) {
    return this.driver.get(name).then(this.options.valid);
  }

  reset() {
    return this.driver.reset();
  }
}

module.exports = Store;
