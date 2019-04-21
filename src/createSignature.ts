import crypto from 'crypto';

import { Headers } from './Headers';
import { SignatureObject } from './SignatureObject';
import { createSignatureString } from './createSignatureString';

export interface CreateSignatureOptions {
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
  pathname: string;
  headers: Record<string, any[] | any>;
  properties: string[];
  keyId: string;
  privateKey: string;
  // TODO: Support 'hmac-sha256' and 'ecdsa-sha256'
  algorithm: 'rsa-sha256';
}

export function createSignature({
  method,
  pathname,
  properties,
  privateKey,
  algorithm,
  keyId,
  headers: rawHeaders,
}: CreateSignatureOptions) {
  const headers = new Headers({
    ...rawHeaders,
    '(request-target)': `${method.toLowerCase()} ${pathname}`,
  });

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(createSignatureString({ headers, properties }));

  const result: SignatureObject = {
    keyId,
    algorithm,
    headers: properties.join('\x20'),
    signature: sign.sign(privateKey).toString('base64'),
  };

  return [
    `keyId="${result.keyId}"`,
    `algorithm="${result.algorithm}"`,
    `headers="${result.headers}"`,
    `signature="${result.signature}"`,
  ].join(',');
}
