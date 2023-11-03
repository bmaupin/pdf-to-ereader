## To do

#### Research

- [x] Pre-existing libraries to convert PDF to HTML
- [x] JavaScript PDF libraries for parsing PDF

#### Functionality

- [x] Output basic HTML with PDF text
- [x] Parse paragraphs
- [ ] Parse headings
- [ ] Parse bold?
  - Might be doable; text weight seems to be based on font name. Same for italics.
- [ ] Parse italics?
- [ ] Parse underline?
- [ ] Parse code snippets
- [ ] Parse block text
- [ ] Parse centred
- [ ] Parse URLs
- [ ] PDF marked content? See [docs/marked-content.md](docs/marked-content.md)

#### Testing

- [ ] Workflow one: generate PDF from HTML, generate HTML from PDF, test generated HTML matches original
  - [x] Manually generate PDF from HTML
  - [ ] Automatically generate PDF from HTML
  - [x] Test generated HTML matches original
- [ ] Workflow two: test generating HTML from complex PDFs
