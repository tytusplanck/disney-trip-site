import { timingSafeEqual } from 'node:crypto';

export type PasswordCheckResult = { ok: true } | { ok: false };

function normalizeInput(input: string, targetLength: number): Buffer {
  const normalized = Buffer.alloc(targetLength);
  Buffer.from(input, 'utf8').copy(normalized, 0, 0, targetLength);
  return normalized;
}

export function checkPassword(input: string, expected: string): PasswordCheckResult {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const inputBuffer = normalizeInput(input, expectedBuffer.length);
  const lengthsMatch = Buffer.byteLength(input, 'utf8') === expectedBuffer.length;
  const isMatch = timingSafeEqual(inputBuffer, expectedBuffer) && lengthsMatch;

  return isMatch ? { ok: true } : { ok: false };
}
