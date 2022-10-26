export class Pdf {
  private arrayBuffer: ArrayBuffer;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;

    this.validateHeader();
    this.validateFooter();
    this.findTrailer();
  }

  private validateHeader() {
    const uintArray = new Uint8Array(this.arrayBuffer, 0, 0x8);
    const header = new TextDecoder('utf8').decode(uintArray);

    if (header.slice(0, 5) !== '%PDF-') {
      throw new Error('Not a valid PDF file');
    }
  }

  private validateFooter() {
    const uintArray = new Uint8Array(
      this.arrayBuffer,
      this.arrayBuffer.byteLength - 6,
      5
    );
    const footer = new TextDecoder('utf8').decode(uintArray);

    if (footer !== '%%EOF') {
      throw new Error('Not a valid PDF file');
    }
  }

  private findTrailer() {
    for (
      let byteOffset = this.arrayBuffer.byteLength - 8;
      byteOffset > 8;
      byteOffset--
    ) {
      if (
        Pdf.compareUint8Arrays(
          new Uint8Array(this.arrayBuffer, byteOffset, 1),
          new Uint8Array([0x0a])
        )
      ) {
        const uintArray = new Uint8Array(this.arrayBuffer, byteOffset - 7, 8);
        const test = new TextDecoder('utf8').decode(uintArray);

        if (test === 'trailer\n') {
          console.log('found=', byteOffset, test);
          break;
        }
      }
    }
  }

  // https://stackoverflow.com/a/19746771/399105
  static compareUint8Arrays = (
    array1: Uint8Array,
    array2: Uint8Array
  ): boolean => {
    return (
      array1.length === array2.length &&
      array1.every(function (value, index: number) {
        return value === array2[index];
      })
    );
  };
}
