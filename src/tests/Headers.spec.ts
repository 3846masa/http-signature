import test from 'ava';

import { Headers } from '../Headers';

test('Headers class can create instance', async (t) => {
  const headers = new Headers();
  t.truthy(headers);
});

test('Headers should return value from case-insensitive proprety name', async (t) => {
  const original = {
    'X-Foo': 'bar',
    'x-CaSe-InsenSITIVE': ['case', 'insensitive'],
  };
  const headers = new Headers(original);

  t.deepEqual(headers['x-foo'], original['X-Foo']);
  t.deepEqual(headers['X-FOO'], original['X-Foo']);
  t.deepEqual(headers['x-case-insensitive'], original['x-CaSe-InsenSITIVE']);
  t.deepEqual(headers['X-CASE-INSENSITIVE'], original['x-CaSe-InsenSITIVE']);
});

test('Headers should set value from case-insensitive proprety name', async (t) => {
  const headers = new Headers();

  headers['x-foo'] = 'foo';
  t.deepEqual(headers['x-foo'], 'foo');

  headers['X-Bar'] = 'bar';
  t.deepEqual(headers['x-bar'], 'bar');

  headers['X-CaSe-InsenSITIVE'] = ['case', 'insensitive'];
  t.deepEqual(headers['x-case-insensitive'], ['case', 'insensitive']);
});
