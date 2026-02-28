import type { APIContext, MiddlewareHandler } from 'astro';

type MockCookieOptions = Record<string, unknown>;

interface MockSetCall {
  name: string;
  value: string;
  options: MockCookieOptions;
}

interface MockDeleteCall {
  name: string;
  options: MockCookieOptions;
}

function buildRedirectResponse(path: string | URL, status = 302): Response {
  const location = typeof path === 'string' ? path : `${path.pathname}${path.search}${path.hash}`;
  return new Response(null, { status, headers: { location } });
}

export class MockCookies {
  private readonly values = new Map<string, string>();
  readonly deleteCalls: MockDeleteCall[] = [];
  readonly setCalls: MockSetCall[] = [];

  constructor(initialValues: Record<string, string> = {}) {
    Object.entries(initialValues).forEach(([name, value]) => {
      this.values.set(name, value);
    });
  }

  delete(name: string, options: MockCookieOptions): void {
    this.deleteCalls.push({ name, options });
    this.values.delete(name);
  }

  get(name: string): { value: string } | undefined {
    const value = this.values.get(name);
    return value === undefined ? undefined : { value };
  }

  set(name: string, value: string, options: MockCookieOptions): void {
    this.setCalls.push({ name, value, options });
    this.values.set(name, value);
  }
}

export function createApiContext(
  url: string,
  cookies = new MockCookies(),
  formData?: FormData,
): APIContext {
  const request = new Request(
    url,
    formData
      ? {
          body: formData,
          method: 'POST',
        }
      : {
          method: 'GET',
        },
  );

  return {
    cookies,
    redirect: buildRedirectResponse,
    request,
    url: new URL(url),
  } as unknown as APIContext;
}

export function createMiddlewareContext(
  url: string,
  cookies = new MockCookies(),
): Parameters<MiddlewareHandler>[0] {
  return {
    cookies,
    redirect: buildRedirectResponse,
    request: new Request(url),
    url: new URL(url),
  } as unknown as Parameters<MiddlewareHandler>[0];
}
