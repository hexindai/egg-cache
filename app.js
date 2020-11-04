'use strict';
const pro = require('process');
const Store = require('./lib/store');

async function cacheSync (app,data) {
  if (data.pid === pro.pid) {
    return;
  }

  switch (data.act) {
  case 0: 
    if( data.isMemSync === true ){
      await app.cache.store('memory').del(data.name, data.isMemSync);
    }
  break;
  case 1:
      if( data.options.isMemSync ){
        await app.cache.store('memory').set( data.name,data.value,data.expire,data.options );
      }
    break;
  default: break;
  }
}


module.exports = app => {
  app.cache = require('./lib/cache')(app);
  process.on('message', msg => {
    if (msg.action === Store.syncKey) {
      cacheSync( app, msg.data );
    }
  });
};
