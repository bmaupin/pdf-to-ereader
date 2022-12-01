import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

import { Pdf } from './Pdf';

describe.skip('Pdf', () => {
  test('Create new Pdf from ArrayBuffer', async () => {
    const arrayBuffer = (
      await readFile(resolve(__dirname, 'testdata/hello-world.pdf'))
    ).buffer;
    const pdf = new Pdf(arrayBuffer);
    expect(pdf).toBeInstanceOf(Pdf);
  });
});

import pdfjsLib from 'pdfjs-dist';

describe.skip('pdf.js', () => {
  test('pdf.js', async () => {
    const loadingTask = pdfjsLib.getDocument({
      // anguish-languish.htmldoc.pdf uses standard non-embedded fonts only
      url: resolve(__dirname, 'testdata/anguish-languish.htmldoc.pdf'),
      // Document.pdf uses mostly non-standard non-embedded fonts, with one embedded (Calibri)
      // url: resolve(__dirname, 'testdata/Document.pdf'),
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);

    const { items, styles } = await page.getTextContent({
      disableCombineTextItems: false,
      includeMarkedContent: true,
    });

    let i = 0;
    for (const item of items) {
      /* Each item has:
         - text content
         - height/width
         - starting x/y (the last 2 values of item.transform)
         - font name (which we can use to get the font family (serif) from the styles parameter)
         - EOL!
       */
      console.log('item=', item);

      i++;
      if (i === 10) break;
    }

    /* Each item has:
       - fontFamily (e.g. serif/sans-serif)
       - other stuff I won't need :P
     */
    // console.log('styles=', (await page.getTextContent()).styles);

    // Get the original font name!
    await page.getOperatorList();
    for (const fontName in styles) {
      console.log('fontName=', fontName);
      console.log('originalFontName=', page.commonObjs.get(fontName).name);
      console.log();
    }
  });
});

/* Playing around in the Node REPL
const pdfjsLib = require('pdfjs-dist');
const path = require('path');
const loadingTask = pdfjsLib.getDocument({
  url: path.resolve('src/testdata/anguish-languish.pdf'),
  fontExtraProperties: true,
});
const doc = await loadingTask.promise;
const page = await doc.getPage(1);
*/
