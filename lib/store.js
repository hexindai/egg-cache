'use strict';

class Store {

  /**
   * @param {Object} driver Cache Manager Store
   */
  constructor(driver) {
    this.driver = driver;
  }

  set(name, value, expire = null, options = null) {
    options = Object.assign({}, options, {
      ttl: expire,
    });

    if (typeof value === 'function') {
      value = value();
    }

    return this.driver.set(name, value, options);
  }

  get(name, defaultValue = null, expire = null, options = null) {
    return this.driver.get(name).then(value => {
      if (value !== undefined) {
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
    return this.driver.get(name).then(value => value !== undefined);
  }

  reset() {
    return this.driver.reset();
  }
}

module.exports = Store;
