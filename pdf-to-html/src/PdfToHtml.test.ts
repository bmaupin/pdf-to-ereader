import { resolve } from 'node:path';
import prettier from 'prettier';
import { beforeAll, describe, expect, test } from 'vitest';

import { PdfToHtml } from './PdfToHtml';

let html: string;

describe('PdfToHtml', () => {
  beforeAll(async () => {
    html = await PdfToHtml.convertPdf(
      resolve(__dirname, 'testdata/hello-world.pdf')
    );
  });

  // TODO: modify the test so it compares against the source HTML file
  test('HTML', async () => {
    const htmlToCheck = `<!DOCTYPE html>
<html>
  <head>
    <title>Test title</title>
  </head>
  <body>
    <article>Hello world</article>
  </body>
</html>`;

    expect(reformatHtml(html)).toEqual(reformatHtml(htmlToCheck));
  });

  // TODO: test document without a title
  test('PDF title', async () => {
    expect(html).toContain('<title>Test title</title>');
  });

  test('PDF body', async () => {
    expect(html).toContain('Hello world');
  });
});

const reformatHtml = (html: string): string => {
  return prettier.format(html, { parser: 'html' });
};
