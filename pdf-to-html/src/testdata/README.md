#### Generating test files

```
for htmlfile in *.html; do htmldoc ${htmlfile} -f $(basename -s .html ${htmlfile}).pdf --footer '' --header '' --no-embedfonts --webpage; done
```

- `--footer ''` disables page numbering
- `--header ''` disables the title in the document; the title is still included in the PDF metadata

#### Testing different tools for generating test files

Testing different tools for generating test PDF files from HTML

The main goal is to have the smallest PDF size possible with all of the content.

| Tool                       | Size   | Title                     | Embedded fonts | Notes                             |
| -------------------------- | ------ | ------------------------- | -------------- | --------------------------------- |
| htmldoc                    | 84 KB  | PDF title and in document | 2              |                                   |
| 👉 htmldoc --no-embedfonts | 2.8 KB | PDF title and in document | 0              | Title in document can be disabled |
| LibreOffice (CLI)          | 1.2 KB | PDF title only            | 0              | ⚠ Document content not included   |
| LibreOffice (GUI)          | 7.3 KB | No title                  | 1 (subset)     |                                   |
| Pandoc                     | 47 KB  | PDF title and in document | 2              |                                   |
| Puppeteer (Chrome)         | 7.1 KB | No title                  | 1 (subset)     |                                   |
| wkhtmltopdf                | 6.9 KB | No title                  | 1              |                                   |
