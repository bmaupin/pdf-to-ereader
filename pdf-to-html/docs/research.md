#### Resources

- [PDF Succinctly](https://www.syncfusion.com/succinctly-free-ebooks/pdf)
- Official PDF specs: [https://www.pdfa.org/resource/pdf-specification-index/](https://www.pdfa.org/resource/pdf-specification-index/)

#### Libraries

- [pdf.js](https://mozilla.github.io/pdf.js/)
  - This may do the trick!
  - Seemingly easy access to document text
  - Access to text location and dimensions
  - Text style (bold, italic, etc) can be determined by getting the original font name (https://github.com/mozilla/pdf.js/pull/10753) as of v3.1.81
- [pdf-lib](https://pdf-lib.js.org/)
  - Too limited, no obvious way to get text
