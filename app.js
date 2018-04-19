'use strict';

module.exports = app => {
  app.cache = require('./lib/cache')(app);
};
