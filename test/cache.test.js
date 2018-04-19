'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const manager = require('cache-manager');

describe('test/cache.test.js', () => {
  let app;

  before(async () => {
    app = mock.app({
      baseDir: 'apps/cache-test',
    });

    await app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should set/get the value to memory', async () => {
    await app.cache.set('name', 'abel');
    const value = await app.cache.get('name');

    assert(value === 'abel');
  });

  it('should cannot get value after expired', async () => {
    await app.cache.set('name', 'abel', 1); // expires after 1 second
    const value = await app.cache.get('name');

    assert(value === 'abel');

    const nullValue = await new Promise(resolve => {
      setTimeout(() => {
        resolve(app.cache.get('name'));
      }, 1500);
    });

    assert(nullValue === null);
  });

  it('should return default value when there is no cache', async () => {
    const value = await app.cache.get('name', 'default-name');

    assert(value === 'default-name');
  });

  it('should return and set default value when defaultValue is callable', async () => {
    let value = await app.cache.get('name', () => {
      return 'abel';
    });

    assert(value === 'abel');

    // has been set
    value = await app.cache.get('name');
    assert(value === 'abel');
  });

  it('should return/set default value when defaultValue is async callable', async () => {
    let value = await app.cache.get('name', () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('abel');
        }, 100);
      });
    });

    assert(value === 'abel');

    // has been set
    value = await app.cache.get('name');
    assert(value === 'abel');
  });

  it('should cached when cache is set', async () => {
    await app.cache.set('name', 'abel');
    const has = await app.cache.has('name');

    assert(has === true);
  });

  it('should not cached when cache is not set', async () => {
    await app.cache.del('name');
    const has = await app.cache.has('name');

    assert(has === false);
  });

  it('should return null when deleted', async () => {
    let value = await app.cache.set('name', 'abel');
    assert(value === 'abel');

    await app.cache.del('name');

    value = await app.cache.get('name');

    assert(value === null);
  });

  it('should return the custom store', async () => {
    const config = app.config.cache.stores.memory;

    mock(manager, 'caching', options => {
      assert(options.store === 'memory');
      assert(options.ttl === config.ttl);
      assert(options.max === config.max);
    });

    await app.cache.store('memory');
  });

  it('should throw error when store not support', async () => {
    let hasError = false;
    try {
      await app.cache.store('air');
    } catch (error) {
      hasError = true;
      assert(/not\ssupport/.test(error.message));
    }

    assert(hasError);
  });
});
