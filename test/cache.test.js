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
    await app.cache.set('foo', 'bar');
    const value = await app.cache.get('foo');

    assert(value === 'bar');
  });

  it('should cannot get value after expired', async () => {
    await app.cache.set('foo', 'bar', 1); // expires after 1 second
    const value = await app.cache.get('foo');

    assert(value === 'bar');

    const nullValue = await new Promise(resolve => {
      setTimeout(() => {
        resolve(app.cache.get('foo'));
      }, 1500);
    });

    assert(nullValue === null);
  });

  it('should return default value when there is no cache', async () => {
    const value = await app.cache.get('foo', 'default');

    assert(value === 'default');
  });

  it('should return and set default value when defaultValue is callable', async () => {
    let value = await app.cache.get('foo', () => {
      return 'bar';
    });

    assert(value === 'bar');

    // has been set
    value = await app.cache.get('foo');
    assert(value === 'bar');
  });

  it('should return/set default value when defaultValue is async callable', async () => {
    let value = await app.cache.get('foo', () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('bar');
        }, 100);
      });
    });

    assert(value === 'bar');

    // has been set
    value = await app.cache.get('foo');
    assert(value === 'bar');
  });

  it('should cached when cache is set', async () => {
    await app.cache.set('foo', 'bar');
    const has = await app.cache.has('foo');

    assert(has === true);
  });

  it('should not cached when cache is not set', async () => {
    await app.cache.del('foo');
    const has = await app.cache.has('foo');

    assert(has === false);
  });

  it('should return null when deleted', async () => {
    let value = await app.cache.set('foo', 'bar');
    assert(value === 'bar');

    await app.cache.del('foo');

    value = await app.cache.get('foo');

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

  it('should clear the cache', async () => {
    await Promise.all([
      app.cache.set('foo', 'bar'),
      app.cache.set('bar', 'foo'),
    ]);

    let [ foo, bar ] = await Promise.all([
      app.cache.get('foo'),
      app.cache.get('bar'),
    ]);

    assert(foo === 'bar');
    assert(bar === 'foo');

    await app.cache.reset();

    [ foo, bar ] = await Promise.all([
      app.cache.get('foo'),
      app.cache.get('bar'),
    ]);

    assert(foo === null);
    assert(bar === null);
  });
});
