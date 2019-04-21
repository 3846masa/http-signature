export interface SignatureObject extends Record<string, string | undefined> {
  keyId: string;
  algorithm?: string;
  headers?: string;
  signature: string;
}
