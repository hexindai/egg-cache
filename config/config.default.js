'use strict';

/**
 * egg-cache default config
 * @member Config#cache
 * @property {String} default - default store
 */
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
