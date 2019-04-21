import test from 'ava';

import { verifySignature } from '../verifySignature';
import { SignatureObject } from '../SignatureObject';

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCFENGw33yGihy92pDjZQhl0C3
6rPJj+CvfSC8+q28hxA161QFNUd13wuCTUcq0Qd2qsBe/2hFyc2DCJJg0h1L78+6
Z4UMR7EOcpfdUE9Hf3m/hs+FUR45uBJeDK1HSFHD8bHKD6kv8FPGfJTotc+2xjJw
oYi+1hqp1fIekaxsyQIDAQAB
-----END PUBLIC KEY-----
`.trim();

test('verifySignature should return signature object when passing valid signature', (t) => {
  const expected: SignatureObject = {
    keyId: 'Test',
    algorithm: 'rsa-sha256',
    headers: '(request-target) host date',
    signature:
      'qdx+H7PHHDZgy4y/Ahn9Tny9V3GP6YgBPyUXMmoxWtLbHpUnXS2mg2+SbrQDMCJypxBLSPQR2aAjn7ndmw2iicw3HMbe8VfEdKFYRqzic+efkb3nndiv/x1xSHDJWeSWkx3ButlYSuBskLu6kd9Fswtemr3lgdDEmn04swr2Os0=',
  };

  const actual = verifySignature({
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

  t.deepEqual(actual, expected);
});

test('verifySignature should cause Error when passing invalid signature', (t) => {
  t.throws(() => {
    verifySignature({
      publicKey,
      signature: `keyId="Test",algorithm="rsa-sha256",headers="(request-target) host date",signature="qdx+H7PHHDZgy4y/Ahn9Tny9V3GP6YgBPyUXMmoxWtLbHpUnXS2mg2+SbrQDMCJypxBLSPQR2aAjn7ndmw2iicw3HMbe8VfEdKFYRqzic+efkb3nndiv/x1xSHDJWeSWkx3ButlYSuBskLu6kd9Fswtemr3lgdDEmn04swr2Os0="`,
      method: 'POST',
      pathname: '/foo?param=value&pet=dog',
      headers: {
        Host: 'example.org',
        Date: 'Sun, 05 Jan 2019 21:31:40 GMT',
        'Content-Type': 'application/json',
        Digest: 'SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=',
        'Content-Length': 18,
      },
      algorithm: 'rsa-sha256',
    });
  });
});
