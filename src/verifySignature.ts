import crypto from 'crypto';

import { Headers } from './Headers';
import { parseSignature } from './parseSignature';
import { createSignatureString } from './createSignatureString';

export interface VerifySignatureOptions {
  signature: string;
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
  pathname: string;
  publicKey: string;
  headers: Record<string, any[] | any>;
  algorithm?: 'rsa-sha256';
}

export function verifySignature({
  signature,
  method,
  pathname,
  publicKey,
  headers: rawHeaders,
}: VerifySignatureOptions) {
  const headers = new Headers({
    ...rawHeaders,
    '(request-target)': `${method.toLowerCase()} ${pathname}`,
  });

  const parsed = parseSignature(signature);
  const properties = parsed.headers.split(/\s+/g).map((p) => p.trim());

  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(createSignatureString({ headers, properties }));

  if (!verify.verify(publicKey, parsed.signature, 'base64')) {
    throw new Error('Invalid signature');
  }

  return parsed;
}
