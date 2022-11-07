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
const util = require('util');

describe('pdf.js', () => {
  test('pdf.js', async () => {
    const loadingTask = pdfjsLib.getDocument({
      url: resolve(__dirname, 'testdata/anguish-languish.pdf'),
      fontExtraProperties: true,
      // useSystemFonts: true,
      // disableFontFace: true,
      keepLoadedFonts: true,
      pdfBug: true,
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    // console.log('page=', inspect(page));

    // This looks like what we want!
    // console.log('page', await page.getTextContent());
    // console.log('page', (await page.getTextContent()).items[0]);

    let i = 0;
    for (const item of (await page.getTextContent()).items) {
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

    // font family
    console.log('styles=', (await page.getTextContent()).styles);

    console.log(
      'doc._transport.fontLoader.nativeFontFaces=',
      doc._transport.fontLoader
    );

    console.log(
      'await page.getOperatorList()=',
      util.inspect(await page.getOperatorList())
    );
    await page.getOperatorList();
    console.log('page.commonObjs=', page.commonObjs);
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
