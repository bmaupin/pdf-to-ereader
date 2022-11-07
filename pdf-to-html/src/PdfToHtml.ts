import pdfjsLib from 'pdfjs-dist';

export class PdfToHtml {
  static async convertPdf(url: string): Promise<string> {
    const loadingTask = pdfjsLib.getDocument({
      url: url,
    });
    const doc = await loadingTask.promise;

    const title = ((await doc.getMetadata()).info as any)?.Title;

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
}
