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

      let previousYCoordinate = 0;

      for (const item of (
        await page.getTextContent({
          disableCombineTextItems: false,
          includeMarkedContent: true,
        })
      ).items) {
        let height = 0;
        let yCoordinate = 0;

        if ('height' in item) {
          height = item.height;
        }

        if ('transform' in item) {
          [, , , , , yCoordinate] = item.transform;
        }

        // TODO: will we need to track changes to line height as well?
        // Start a new paragraph based on the spacing between lines
        if (height && yCoordinate) {
          // PDFs are processed from top to bottom
          if ((previousYCoordinate - yCoordinate) / 2 > height) {
            body += '</p>';
            body += '<p>';
          }
        }

        if ('str' in item) {
          if (item.hasEOL && !body.endsWith(' ') && !item.str.startsWith(' ')) {
            body += ' ';
          }
          body += item.str;
        }

        previousYCoordinate = yCoordinate;

        // DELETEME
        console.log('item=', item);
      }
    }

    // TODO: later, we'll need to probably track whether we're in a paragraph or not
    body += '</p>';

    return body;
  }
}
