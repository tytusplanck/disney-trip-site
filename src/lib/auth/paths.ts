const PUBLIC_PATHS = new Set(['/api/auth/login', '/favicon.svg', '/login', '/robots.txt']);
const PUBLIC_PREFIXES = ['/_astro/'];

export interface PublicPathDecision {
  isPublic: boolean;
}

export function normalizePathname(pathname: string): string {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getPublicPathDecision(pathname: string): PublicPathDecision {
  const normalizedPathname = normalizePathname(pathname);
  const isPublic =
    PUBLIC_PATHS.has(normalizedPathname) ||
    PUBLIC_PREFIXES.some((prefix) => normalizedPathname.startsWith(prefix));

  return { isPublic };
}

export function sanitizeRedirectTarget(candidate: FormDataEntryValue | null | undefined): string {
  if (typeof candidate !== 'string' || candidate.length === 0) {
    return '/';
  }

  try {
    const url = new URL(candidate, 'https://private.example');

    if (url.origin !== 'https://private.example') {
      return '/';
    }

    const normalizedPathname = normalizePathname(url.pathname);

    return `${normalizedPathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}
