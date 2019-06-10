export interface SignatureObject extends Record<string, string | undefined> {
  keyId: string;
  algorithm?: string;
  headers?: string;
  signature: string;
}

export interface SignatureObjectWithHeaders extends SignatureObject {
  headers: string;
}

export function isValidSignatureObject(object: Record<string, string | undefined>): object is SignatureObject {
  return object.keyId && object.signature ? true : false;
}
