// To run:
// cd src/testdata; npx ts-node ../../scripts/build-testdata.ts

import { readdir } from 'node:fs/promises';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';

const INPUT_EXTENSION = '.html';
const OUTPUT_EXTENSION = '.pdf';

const main = async () => {
  const filesInCwd = await getFilesInCwd();
  await printFilesToPdf(filesInCwd);
};

const getFilesInCwd = async () => {
  return await readdir(process.cwd());
};

const printFilesToPdf = async (files: string[]) => {
  const browser = await puppeteer.launch();

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    if (filename.endsWith(INPUT_EXTENSION)) {
      await printToPdf(browser, `file:${path.join(process.cwd(), filename)}`);
    }
  }
  await browser.close();
};

// https://developers.google.com/web/updates/2017/04/headless-chrome#screenshots
const printToPdf = async (browser: Browser, inputUrl: string) => {
  const outputFilename =
    path.basename(inputUrl, INPUT_EXTENSION) + OUTPUT_EXTENSION;
  const page = await browser.newPage();

  await page.goto(inputUrl);
  await page.pdf({ path: outputFilename });
};

main();
