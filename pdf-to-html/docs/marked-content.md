# Marked content

## Overview

Marked content is an optional feature of PDFs that can allow them to hold formatting tags (see below for some examples). Unfortunately this marked content is inconsistent across tools that generate PDFs and therefore will be inconsistent across PDFs.

Since it's inconsistent, I think for now the best approach would be to not rely on it for now. But it's good to know about it and we can keep it in mind as we develop algorithms for processing the text manually.

#### Implementation idea

1. Go through all text items in the document and put any unique marked content tags into an array
1. Go through the text items again for manual processing
1. If marked content is found, use that logic
1. If a manual processing step is found that matches a marked content tag in the array, skip it

This would assume that if a marked content tag is found in a document, we could rely on marked content alone for all occurrences of that tag and skip manual processing.

This would also require that the each step of the manual processing algorithm is aware of which tag it's accounting for, and there would need to be matching logic for handling marked content for each tag to process.

In the end it would result in two fundamentally different ways of processing the text that would need to be carefully designed to work together. This seems complex and error-prone so it might only be worth it in instances where we're unable to achieve consistently satisfactory results with the manual processing algorithms.

## Tools

#### Htmldoc

Htmldoc doesn't seem to generate marked content.

#### LibreOffice

LibreOffice can mark a lot of different tags if the PDF is created using the GUI and the _Tagged PDF_ option is checked when exporting to PDF, e.g.

```
item= {
  type: 'beginMarkedContentProps',
  id: 'page218R_mcid39',
  tag: 'Text body'
}
item= { type: 'endMarkedContent' }
item= { type: 'beginMarkedContent', tag: 'Artifact' }
item= { type: 'endMarkedContent' }
item= { type: 'beginMarkedContentProps', id: 'page241R_mcid2', tag: 'H1' }
item= { type: 'endMarkedContent' }
item= { type: 'beginMarkedContentProps', id: 'page241R_mcid3', tag: 'H2' }
item= { type: 'endMarkedContent' }
item= {
  type: 'beginMarkedContentProps',
  id: 'page241R_mcid4',
  tag: 'BlockQuote'
}
```

#### Puppeteer

Puppeteer only seems to mark `p` tags, e.g.

```
item= { type: 'beginMarkedContentProps', id: 'page12R_mcid27', tag: 'P' }
item= { type: 'endMarkedContent' }
```
