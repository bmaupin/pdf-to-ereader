import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { inspect } from 'node:util';

import { describe, expect, test } from 'vitest';

import { Pdf } from './Pdf';

import { PDFDocument } from 'pdf-lib';

describe.skip('Pdf', () => {
  test('Create new Pdf from ArrayBuffer', async () => {
    const arrayBuffer = (
      await readFile(resolve(__dirname, 'testdata/hello-world.pdf'))
    ).buffer;
    const pdf = new Pdf(arrayBuffer);
    expect(pdf).toBeInstanceOf(Pdf);
  });
});

describe('pdf-lib', () => {
  test('pdf-lib', async () => {
    const arrayBuffer = (
      await readFile(resolve(__dirname, 'testdata/hello-world.pdf'))
    ).buffer;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    console.log('firstPage=', inspect(firstPage));
  });
});

/* Playing with pdf-lib in node REPL:
const pdfLib = require('pdf-lib');
const fs = require('fs');
const path = require('path');

let arrayBuffer = fs.readFileSync(path.resolve('src/testdata/hello-world.pdf')).buffer;
let pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
const pages = pdfDoc.getPages();
const firstPage = pages[0];
*/

/*
firstPage.node is a map to pdf
*/
