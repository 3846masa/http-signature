import test from 'ava';

import { Headers } from '../Headers';
import { createSignatureString } from '../createSignatureString';

test('createSignatureString should create Signature String', (t) => {
  const headers = new Headers({
    '(request-target)': 'post /foo?param=value&pet=dog',
    Host: 'example.com',
    Date: 'Sun, 05 Jan 2014 21:31:40 GMT',
    'Content-Type': 'application/json',
    Digest: 'SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=',
    'Content-Length': '18',
  });

  const expected = `
(request-target): post /foo?param=value&pet=dog
host: example.com
date: Sun, 05 Jan 2014 21:31:40 GMT
  `.trim();

  const actual = createSignatureString({
    headers,
    properties: ['(request-target)', 'host', 'date'],
  });

  t.is(actual, expected);
});

test('createSignatureString should create Signature String from complex headers', (t) => {
  const headers = new Headers({
    '(request-target)': 'get /foo',
    Host: 'example.org',
    Date: 'Tue, 07 Jun 2014 20:51:35 GMT',
    'X-Example': `Example header
        with some whitespace.`,
    'X-EmptyHeader': '',
    'Cache-Control': ['max-age=60', 'must-revalidate'],
  });

  const expected = `
(request-target): get /foo
host: example.org
date: Tue, 07 Jun 2014 20:51:35 GMT
cache-control: max-age=60, must-revalidate
x-emptyheader: 
x-example: Example header with some whitespace.
  `.trim();

  const actual = createSignatureString({
    headers,
    properties: ['(request-target)', 'host', 'date', 'cache-control', 'x-emptyheader', 'x-example'],
  });

  t.is(actual, expected);
});
