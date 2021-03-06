import { SignatureObjectWithHeaders, isValidSignatureObject } from './SignatureObject';

type ParseMode = 'key' | 'prevalue' | 'value' | 'postvalue';

export function parseSignature(signature: string): SignatureObjectWithHeaders {
  const result = {
    headers: 'date',
  } as SignatureObjectWithHeaders;

  const state = {
    cursor: 0,
    mode: 'key' as ParseMode,
    currentKey: '',
    currentValue: '',
  };

  for (let idx = 0; idx < signature.length; idx++) {
    const char = signature[idx];

    switch (state.mode) {
      case 'key': {
        if (char === '=') {
          Object.assign(state, {
            mode: 'prevalue',
            currentKey: state.currentKey.trim(),
          });
        } else {
          Object.assign(state, {
            currentKey: state.currentKey + char,
          });
        }
        continue;
      }

      case 'prevalue': {
        if (char === '"') {
          Object.assign(state, {
            mode: 'value',
          });
        }
        continue;
      }

      case 'value': {
        if (char === '"') {
          result[state.currentKey] = state.currentValue.trim();
          Object.assign(state, {
            mode: 'postvalue',
            currentKey: '',
            currentValue: '',
          });
        } else {
          Object.assign(state, {
            currentValue: state.currentValue + char,
          });
        }
        continue;
      }

      case 'postvalue': {
        if (char === ',') {
          Object.assign(state, {
            mode: 'key',
          });
        }
        continue;
      }
    }
  }

  if (!isValidSignatureObject(result)) {
    throw new Error('keyId and signature paramerters should be required.');
  }

  return result;
}
