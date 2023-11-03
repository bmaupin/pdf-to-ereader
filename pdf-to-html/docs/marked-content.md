# Marked content

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
