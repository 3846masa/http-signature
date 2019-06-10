import crypto from 'crypto';

import { Headers } from './Headers';
import { createSignatureString } from './createSignatureString';
import { SignatureObjectWithHeaders } from './SignatureObject';

export interface VerifySignatureOptions {
  signature: SignatureObjectWithHeaders;
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

  const properties = signature.headers.split(/\s+/g).map((p) => p.trim());

  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(createSignatureString({ headers, properties }));

  if (!verify.verify(publicKey, signature.signature, 'base64')) {
    return false;
  }
  return true;
}
