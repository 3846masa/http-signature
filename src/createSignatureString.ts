import { Headers } from './Headers';

/** @private */
export function createSignatureString({ headers, properties }: { headers: Headers; properties: string[] }) {
  const dataList: string[] = [];

  for (const property of properties) {
    const value = headers[property];
    const stringified = Array.isArray(value) ? value.join(',\x20') : value.toString().replace(/\s*\n\s*/g, '\x20');
    dataList.push(`${property.toLowerCase()}: ${stringified.trim()}`);
  }

  return dataList.join('\n');
}
