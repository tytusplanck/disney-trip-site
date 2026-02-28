import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceRoot = join(process.cwd(), 'src');
const markupExtensions = new Set(['.astro', '.html', '.jsx', '.tsx']);

function collectMarkupFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const resolvedPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectMarkupFiles(resolvedPath);
    }

    return markupExtensions.has(extname(entry.name)) ? [resolvedPath] : [];
  });
}

describe('inline style convention', () => {
  it('does not allow inline style attributes in UI source files', () => {
    const offendingFiles = collectMarkupFiles(sourceRoot).filter((filePath) =>
      /\bstyle\s*=/.test(readFileSync(filePath, 'utf8')),
    );

    expect(offendingFiles).toEqual([]);
  });
});
