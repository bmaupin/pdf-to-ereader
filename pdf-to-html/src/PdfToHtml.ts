import pdfjsLib, { PDFDocumentProxy } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

export class PdfToHtml {
  static async convertPdf(url: string): Promise<string> {
    const loadingTask = pdfjsLib.getDocument({
      url: url,
    });
    const doc = await loadingTask.promise;

    const title = await PdfToHtml.getTitle(doc);

    const body = await PdfToHtml.getBody(doc);

    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <article>
      ${body}
    </article>
  </body>
</html>`
      .trimStart()
      .trim();
  }

  private static async getTitle(doc: PDFDocumentProxy): Promise<string> {
    const title = ((await doc.getMetadata()).info as any)?.Title;
    if (!title) {
      // TODO: later, add some logic to try to derive the title from the first heading
      // element on the first page since HTML titles aren't optional
      return 'No title';
    } else {
      return title;
    }
  }

  private static async getBody(doc: PDFDocumentProxy): Promise<string> {
    let body = '';

    // Start with a clean paragraph
    // TODO: later we'll need to process titles/headings before starting the first paragraph
    body += '<p>';

    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);

      // This is required to get the original font name (https://github.com/mozilla/pdf.js/pull/10753#issuecomment-1334155825)
      await page.getOperatorList();

      let prevYCoordinate = 0;

      for (const item of (
        await page.getTextContent({
          disableCombineTextItems: false,
          includeMarkedContent: true,
        })
      ).items) {
        // TODO: Handle PDF marked content
        // This filters out items that are of type TextMarkedContent; from here on out,
        // all items are of type TextItem
        if ('type' in item) {
          console.warn('PDF marked content found!: ', item);
          continue;
        }

        const originalFontName: string = page.commonObjs.get(
          item.fontName
        ).name;
        const bold = originalFontName.toLowerCase().includes('bold');

        // DELETEME
        console.log('originalFontName=', originalFontName);

        // Y coordinate of where the text starts. PDFs are processed from top to bottom
        // but the Y coordinate is the distance from the bottom of the page.
        const yCoordinate = item.transform[5];

        // TODO: will we need to track changes to line height as well?
        // Start a new paragraph based on the spacing between lines
        if ((prevYCoordinate - yCoordinate) / 2 > item.height) {
          body += '</p>';
          body += '<p>';
        } else if (
          'str' in item &&
          !body.endsWith(' ') &&
          !item.str.startsWith(' ')
        ) {
          body += ' ';
        }

        if (bold) {
          body += '<strong>';
        }

        if ('str' in item) {
          body += item.str;
        }

        if (bold) {
          body += '</strong>';
        }

        prevYCoordinate = yCoordinate;

        // DELETEME
        console.log('item=', item);
      }
    }

    // TODO: later, we'll need to probably track whether we're in a paragraph or not
    body += '</p>';

    return body;
  }
}
