import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { Pdf } from './Pdf';

describe('Pdf', () => {
  test('Create new Pdf from ArrayBuffer', async () => {
    const arrayBuffer = (
      await readFile(resolve(__dirname, 'testdata/hello-world.pdf'))
    ).buffer;
    const pdf = new Pdf(arrayBuffer);
    expect(pdf).toBeInstanceOf(Pdf);
  });
});
