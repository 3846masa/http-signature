# [@3846masa/http-signature](https://www.npmjs.com/package/@3846masa/http-signature) <!-- omit in toc -->

[![NPM](https://nodei.co/npm/@3846masa/http-signature.png?mini=true)](https://www.npmjs.com/package/@3846masa/http-signature)
[![CircleCI](https://flat.badgen.net/circleci/github/3846masa/http-signature)](https://circleci.com/gh/3846masa/http-signature)
[![Codecov](https://flat.badgen.net/codecov/c/github/3846masa/http-signature)](https://codecov.io/gh/3846masa/http-signature)

> Create / Verify [HTTP Signatures](https://tools.ietf.org/html/draft-cavage-http-signatures-10)

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Create signature](#create-signature)
  - [Verify signature](#verify-signature)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install --save @3846masa/http-signature
```

```bash
yarn add @3846masa/http-signature
```

TypeScript definitions is included.

## Usage

### Create signature

```ts
import { createSignature } from '@3846masa/http-signature';

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDCFENGw33yGihy92pDjZQhl0C36rPJj+CvfSC8+q28hxA161QF
NUd13wuCTUcq0Qd2qsBe/2hFyc2DCJJg0h1L78+6Z4UMR7EOcpfdUE9Hf3m/hs+F
UR45uBJeDK1HSFHD8bHKD6kv8FPGfJTotc+2xjJwoYi+1hqp1fIekaxsyQIDAQAB
AoGBAJR8ZkCUvx5kzv+utdl7T5MnordT1TvoXXJGXK7ZZ+UuvMNUCdN2QPc4sBiA
QWvLw1cSKt5DsKZ8UETpYPy8pPYnnDEz2dDYiaew9+xEpubyeW2oH4Zx71wqBtOK
kqwrXa/pzdpiucRRjk6vE6YY7EBBs/g7uanVpGibOVAEsqH1AkEA7DkjVH28WDUg
f1nqvfn2Kj6CT7nIcE3jGJsZZ7zlZmBmHFDONMLUrXR/Zm3pR5m0tCmBqa5RK95u
412jt1dPIwJBANJT3v8pnkth48bQo/fKel6uEYyboRtA5/uHuHkZ6FQF7OUkGogc
mSJluOdc5t6hI1VsLn0QZEjQZMEOWr+wKSMCQQCC4kXJEsHAve77oP6HtG/IiEn7
kpyUXRNvFsDE0czpJJBvL/aRFUJxuRK91jhjC68sA7NsKMGg5OXb5I5Jj36xAkEA
gIT7aFOYBFwGgQAQkWNKLvySgKbAZRTeLBacpHMuQdl1DfdntvAyqpAZ0lY0RKmW
G6aFKaqQfOXKCyWoUiVknQJAXrlgySFci/2ueKlIE1QqIiLSZ8V8OlpFLRnb1pzI
7U1yQXnTAEFYM560yJlzUpOb1V4cScGd365tiSMvxLOvTA==
-----END RSA PRIVATE KEY-----
`.trim();

createSignature({
  privateKey,
  keyId: 'Test',
  method: 'POST',
  pathname: '/foo?param=value&pet=dog',
  headers: {
    Host: 'example.com',
    Date: 'Sun, 05 Jan 2014 21:31:40 GMT',
    'Content-Type': 'application/json',
    Digest: 'SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=',
    'Content-Length': 18,
  },
  properties: ['(request-target)', 'host', 'date'],
  algorithm: 'rsa-sha256',
});

// keyId="Test",algorithm="rsa-sha256",headers="(request-target) host date",signature="qdx+H7PHHDZgy4y/Ahn9Tny9V3GP6YgBPyUXMmoxWtLbHpUnXS2mg2+SbrQDMCJypxBLSPQR2aAjn7ndmw2iicw3HMbe8VfEdKFYRqzic+efkb3nndiv/x1xSHDJWeSWkx3ButlYSuBskLu6kd9Fswtemr3lgdDEmn04swr2Os0="
```

### Verify signature

```ts
import { verifySignature } from '@3846masa/http-signature';

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCFENGw33yGihy92pDjZQhl0C3
6rPJj+CvfSC8+q28hxA161QFNUd13wuCTUcq0Qd2qsBe/2hFyc2DCJJg0h1L78+6
Z4UMR7EOcpfdUE9Hf3m/hs+FUR45uBJeDK1HSFHD8bHKD6kv8FPGfJTotc+2xjJw
oYi+1hqp1fIekaxsyQIDAQAB
-----END PUBLIC KEY-----
`.trim();

try {
  verifySignature({
    publicKey,
    signature: `keyId="Test",algorithm="rsa-sha256",headers="(request-target) host date",signature="qdx+H7PHHDZgy4y/Ahn9Tny9V3GP6YgBPyUXMmoxWtLbHpUnXS2mg2+SbrQDMCJypxBLSPQR2aAjn7ndmw2iicw3HMbe8VfEdKFYRqzic+efkb3nndiv/x1xSHDJWeSWkx3ButlYSuBskLu6kd9Fswtemr3lgdDEmn04swr2Os0="`,
    method: 'POST',
    pathname: '/foo?param=value&pet=dog',
    headers: {
      Host: 'example.com',
      Date: 'Sun, 05 Jan 2014 21:31:40 GMT',
      'Content-Type': 'application/json',
      Digest: 'SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=',
      'Content-Length': 18,
    },
    algorithm: 'rsa-sha256',
  });
} catch (err) {
  console.error(err);
}
```

## Contributing

1. [Fork it](http://github.com/3846masa/http-signature/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Lint codes before pushing (`yarn lint`)
5. Push to the branch (`git push origin my-new-feature`)
6. Run tests before creating PR (`yarn test`)
7. Create new Pull Request

PRs accepted.

## License

[MIT (c) 3846masa](https://github.com/3846masa/http-signature/blob/master/LICENSE)
