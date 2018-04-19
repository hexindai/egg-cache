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

    return this.driver.set(name, value, options);
  }

  get(name, defaultValue = null) {
    return this.driver.get(name).then(value => {
      return value === undefined ? defaultValue : value;
    });
  }
}

module.exports = Store;
