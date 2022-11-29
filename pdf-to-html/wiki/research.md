#### Resources

- [PDF Succinctly](https://www.syncfusion.com/succinctly-free-ebooks/pdf)
- Official PDF specs: [https://www.pdfa.org/resource/pdf-specification-index/](https://www.pdfa.org/resource/pdf-specification-index/)

#### Libraries

- [pdf.js](https://mozilla.github.io/pdf.js/)
  - This may do the trick!
  - Seemingly easy access to document text
  - Access to text location and dimensions
  - Need to figure out a way to get text style (bold, etc)
- [pdf-lib](https://pdf-lib.js.org/)
  - Too limited, no obvious way to get text

#### pdf.js patches

- Add the original font name to the `TextStyle` object:

  ```
  sed -i 's/fontFamily: font.fallbackName,/fontFamily: font.fallbackName,\n          originalFontName: font.name,/'  node_modules/pdfjs-dist/build/pdf.worker.js
  ```
