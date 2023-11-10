import { JSDOM } from 'jsdom';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import puppeteer, { Browser } from 'puppeteer';
import prettier from 'prettier';
import { beforeAll, describe, expect, test } from 'vitest';

import { PdfToHtml } from './PdfToHtml';

const testdataDirectory = path.resolve(__dirname, 'testdata/');
// List of HTML test files to automatically convert to PDF when the tests are run
const testHtmlFilesToConvert = ['simple-page.html'];

let generatedHtml: string;
let sourceHtml: string;

const reformatHtml = (html: string): string => {
  return prettier.format(html, { parser: 'html' });
};

const buildTestData = async () => {
  const INPUT_EXTENSION = '.html';
  const OUTPUT_EXTENSION = '.pdf';

  const printFilesToPdf = async (files: string[]) => {
    const browser = await puppeteer.launch();

    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (filename.endsWith(INPUT_EXTENSION)) {
        const htmlFilePath = path.join(testdataDirectory, filename);
        const pdfFilePath = htmlFilePath.replace(/\.html$/, '.pdf');

        const pdfFile = await printToPdf(browser, `file:${htmlFilePath}`);
        const title = await getTitleFromHtml(htmlFilePath);
        await setPdfTitle(pdfFile, pdfFilePath, title);
      }
    }
    await browser.close();
  };

  // https://developers.google.com/web/updates/2017/04/headless-chrome#screenshots
  const printToPdf = async (
    browser: Browser,
    inputUrl: string
  ): Promise<Buffer> => {
    console.info('Printing to PDF: ', inputUrl);
    const outputFilename =
      path.basename(inputUrl, INPUT_EXTENSION) + OUTPUT_EXTENSION;
    const outputPath = path.join(testdataDirectory, outputFilename);
    const page = await browser.newPage();

    await page.goto(inputUrl);
    return await page.pdf({ path: outputPath });
  };

  const getTitleFromHtml = async (htmlFilePath: string): Promise<string> => {
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const html = parser.parseFromString(
      (await readFile(htmlFilePath)).toString(),
      'text/html'
    );
    return html.title;
  };

  const setPdfTitle = async (
    pdfFile: Buffer,
    pdfFilePath: string,
    title: string
  ) => {
    const pdfDoc = await PDFDocument.load(pdfFile);
    pdfDoc.setTitle(title);
    const pdfBytes = await pdfDoc.save();
    await writeFile(pdfFilePath, pdfBytes);
  };

  await printFilesToPdf(testHtmlFilesToConvert);
};

beforeAll(async () => {
  await buildTestData();
  // TODO: edit titles for test data...
});

describe('simple-page.pdf', () => {
  beforeAll(async () => {
    sourceHtml = (
      await readFile(path.join(testdataDirectory, 'simple-page.html'))
    ).toString();
    generatedHtml = await PdfToHtml.convertPdf(
      path.resolve(__dirname, 'testdata/simple-page.pdf')
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
