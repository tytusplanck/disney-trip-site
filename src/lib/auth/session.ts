import { createHmac, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE_NAME = 'site_access';
const SESSION_SCOPE = 'site';

type SessionScope = typeof SESSION_SCOPE;

export interface SessionPayload {
  scope: SessionScope;
  issuedAt: string;
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function decodePayload(encodedPayload: string): SessionPayload | null {
  try {
    const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed: unknown = JSON.parse(decoded);

    if (!isSessionPayload(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return candidate['scope'] === SESSION_SCOPE && typeof candidate['issuedAt'] === 'string';
}

function createSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseCookieSegments(value: string): { payload: string; signature: string } | null {
  const segments = value.split('.');

  if (segments.length !== 2) {
    return null;
  }

  const payload = segments[0];
  const signature = segments[1];

  if (typeof payload !== 'string' || typeof signature !== 'string') {
    return null;
  }

  return { payload, signature };
}

export function createSessionCookieValue(
  secret: string,
  issuedAt = new Date().toISOString(),
): string {
  const payload = encodePayload({
    scope: SESSION_SCOPE,
    issuedAt,
  });
  const signature = createSignature(payload, secret);

  return `${payload}.${signature}`;
}

export function verifySessionCookieValue(
  value: string | undefined,
  secret: string,
): SessionPayload | null {
  if (!value) {
    return null;
  }

  const parsedSegments = parseCookieSegments(value);

  if (!parsedSegments) {
    return null;
  }

  const { payload, signature } = parsedSegments;
  const expectedSignature = createSignature(payload, secret);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  return decodePayload(payload);
}

export function getSessionCookieOptions(isSecure: boolean) {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'strict' as const,
    secure: isSecure,
  };
}
