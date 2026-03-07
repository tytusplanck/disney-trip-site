import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const loginSource = readFileSync(resolve(process.cwd(), 'src/pages/login.astro'), 'utf8');
const authStyles = readFileSync(resolve(process.cwd(), 'src/styles/auth.css'), 'utf8');

describe('login autofill contract', () => {
  it('uses a masked text field instead of password-field semantics', () => {
    expect(loginSource).toContain('type="text"');
    expect(loginSource).toContain('name="siteKey"');
    expect(loginSource).toContain('autocomplete="off"');
    expect(loginSource).not.toContain('type="password"');
    expect(authStyles).toContain('-webkit-text-security: disc;');
  });
});
