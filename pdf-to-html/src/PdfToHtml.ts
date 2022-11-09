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

    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);

      for (const item of (
        await page.getTextContent({
          disableCombineTextItems: false,
          includeMarkedContent: true,
        })
      ).items) {
        if ('str' in item) {
          body += item.str;
        }

        console.log('item=', item);
      }
    }
    return body;
  }
}
