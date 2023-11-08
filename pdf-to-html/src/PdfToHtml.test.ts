import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer, { Browser } from 'puppeteer';
import prettier from 'prettier';
import { beforeAll, describe, expect, test } from 'vitest';

import { PdfToHtml } from './PdfToHtml';

const testdataDirectory = path.resolve(__dirname, 'testdata/');

let generatedHtml: string;
let sourceHtml: string;

const reformatHtml = (html: string): string => {
  return prettier.format(html, { parser: 'html' });
};

const buildTestData = async () => {
  const INPUT_EXTENSION = '.html';
  const OUTPUT_EXTENSION = '.pdf';

  const getTestdataFiles = async () => {
    return await readdir(testdataDirectory);
  };

  const printFilesToPdf = async (files: string[]) => {
    const browser = await puppeteer.launch();

    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (filename.endsWith(INPUT_EXTENSION)) {
        await printToPdf(
          browser,
          `file:${path.join(testdataDirectory, filename)}`
        );
      }
    }
    await browser.close();
  };

  // https://developers.google.com/web/updates/2017/04/headless-chrome#screenshots
  const printToPdf = async (browser: Browser, inputUrl: string) => {
    console.info('Printing to PDF: ', inputUrl);
    const outputFilename =
      path.basename(inputUrl, INPUT_EXTENSION) + OUTPUT_EXTENSION;
    const outputPath = path.join(testdataDirectory, outputFilename);
    const page = await browser.newPage();

    await page.goto(inputUrl);
    await page.pdf({ path: outputPath });
  };

  const filesInCwd = await getTestdataFiles();
  console.log('filesInCwd: ', filesInCwd);
  await printFilesToPdf(filesInCwd);
};

beforeAll(async () => {
  await buildTestData();
  // TODO: edit titles for test data...
});

describe('simple-page.pdf', () => {
  beforeAll(async () => {
    sourceHtml = (
      await readFile(path.resolve(__dirname, 'testdata/simple-page.html'))
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
