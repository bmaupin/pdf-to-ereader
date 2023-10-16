import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import prettier from 'prettier';
import { beforeAll, describe, expect, test } from 'vitest';

import { PdfToHtml } from './PdfToHtml';

let generatedHtml: string;
let sourceHtml: string;

describe('simple-page.pdf', () => {
  beforeAll(async () => {
    sourceHtml = (
      await readFile(resolve(__dirname, 'testdata/simple-page.html'))
    ).toString();
    generatedHtml = await PdfToHtml.convertPdf(
      resolve(__dirname, 'testdata/simple-page.pdf')
    );
  });

  test('HTML', async () => {
    expect(reformatHtml(generatedHtml)).toEqual(reformatHtml(sourceHtml));
  });

  // TODO: test document without a title
  test('HTML title', async () => {
    expect(generatedHtml).toContain('<title>Simple test page</title>');
  });

  test('HTML body', async () => {
    expect(generatedHtml).toContain('This text is neither bold nor italic');
  });
});

const reformatHtml = (html: string): string => {
  return prettier.format(html, { parser: 'html' });
};
