import { resolve } from 'node:path';

import { beforeAll, describe, expect, test } from 'vitest';

import { PdfToHtml } from './PdfToHtml';

let html: string;

describe('PdfToHtml', () => {
  beforeAll(async () => {
    html = await PdfToHtml.convertPdf(
      resolve(__dirname, 'testdata/hello-world.pdf')
    );
  });

  // TODO: test document without a title
  test('PDF title', async () => {
    expect(html).toContain('<title>Test title</title>');
  });
});
