import pdfjsLib, { PDFDocumentProxy } from 'pdfjs-dist';

export class PdfToHtml {
  static async convertPdf(url: string): Promise<string> {
    const loadingTask = pdfjsLib.getDocument({
      url: url,
    });
    const doc = await loadingTask.promise;

    const title = await PdfToHtml.getTitle(doc);

    // const page = await doc.getPage(1);

    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>

  </body>
</html>
    `;
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
}
