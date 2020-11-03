'use strict';
const pro = require('process');

async function cacheSync (app,data) {
  if (data.pid === pro.pid) {
    return;
  }

  switch (data.act) {
  case 0: app.cache.del(data); break;
  case 1:
    if (data.ttl > 0) {
      app.cache.set(data);
    } else {
      app.cache.set(data);
    }
    break;
  default: break;
  }

}


module.exports = app => {
  app.cache = require('./lib/cache')(app);
  const { default: defaultStore, stores } = app.config.cache;
  if( defaultStore === 'memory' ) {
    const key = ( stores.memory && stores.memory.syncKey ) ? stores.memory.syncKey : 'cacheSync';
    process.on('message', msg => {
      if (msg.action === key) {
        cacheSync( app, msg.data );
      }
    });
  }
};
