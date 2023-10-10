## Convert PDF to HTML

#### Goal

Convert PDF to HTML in JavaScript from the client

#### Resources

- [PDF Succinctly](https://www.syncfusion.com/succinctly-free-ebooks/pdf)
- Official PDF specs: [https://www.pdfa.org/resource/pdf-specification-index/](https://www.pdfa.org/resource/pdf-specification-index/)

#### Idea 1: use existing PDF to HTML tools

The idea would be to use existing tools to convert from PDF to HTML and then clean up the HTML output for e-Readers.

- [pdf.js](https://mozilla.github.io/pdf.js/) doesn't really convert the PDF to HTML but rather renders the PDF to either a canvas element or SVG, and I don't think either of those would be useful for this project.
- [pdftohtmljs](https://github.com/fagbokforlaget/pdftohtmljs) is JavaScript but unfortunately it's just a shell wrapper for [pdf2htmlEX](https://github.com/coolwanglu/pdf2htmlEX), which is an amazing CLI tool that looks almost exactly like what we'd want and itself is based on the C++ [poppler](https://gitlab.freedesktop.org/poppler/poppler) library.
- It looks like [poppler](https://gitlab.freedesktop.org/poppler/poppler) itself has built-in `pdftohtml` functionality. We could potentially run poppler in the browser via WebAssembly but there isn't much existing work we could build on top of and this would be a lot of work for output that we'd only need to clean up afterward ...

#### Idea 2: do the work ourselves using a PDF library

Libraries tested:

- [pdf.js](https://mozilla.github.io/pdf.js/)
  - This may do the trick!
  - Seemingly easy access to document text
  - Access to text location and dimensions
  - Text style (bold, italic, etc) can be determined by getting the original font name (https://github.com/mozilla/pdf.js/pull/10753) as of v3.1.81
- [pdf-lib](https://pdf-lib.js.org/)
  - Too limited, no obvious way to get text
