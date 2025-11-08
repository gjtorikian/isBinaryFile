import * as fs from 'fs';
import { promisify } from 'util';

const statAsync = promisify(fs.stat);
const openAsync = promisify(fs.open);
const closeAsync = promisify(fs.close);

const MAX_BYTES: number = 512;

// Standard UTF-8 max sequence length: 4 bytes (RFC 3629)
// Type-checked to only allow 1-4; recommend 4 for standard UTF-8
type ValidUTF8Length = 1 | 2 | 3 | 4;
const MAX_UTF8_BYTE_LENGTH: ValidUTF8Length = 4;

// Read extra bytes to validate UTF-8 sequences at buffer boundary
const READ_BUFFER_SIZE: number = MAX_BYTES + MAX_UTF8_BYTE_LENGTH - 1;

// A very basic non-exception raising reader. Read bytes and
// at the end use hasError() to check whether this worked.
class Reader {
  public fileBuffer: Buffer;
  public size: number;
  public offset: number;
  public error: boolean;

  constructor(fileBuffer: Buffer, size: number) {
    this.fileBuffer = fileBuffer;
    this.size = size;
    this.offset = 0;
    this.error = false;
  }

  public hasError(): boolean {
    return this.error;
  }

  public nextByte(): number {
    if (this.offset === this.size || this.hasError()) {
      this.error = true;
      return 0xff;
    }
    return this.fileBuffer[this.offset++];
  }

  public next(len: number): number[] {
    const n = new Array();
    for (let i = 0; i < len; i++) {
      // Stop reading if an error occurred
      if (this.error) {
        return n;
      }
      n[i] = this.nextByte();
    }
    return n;
  }
}

// Read a Google Protobuf var(iable)int from the buffer.
function readProtoVarInt(reader: Reader): number {
  let idx = 0;
  let varInt = 0;

  while (!reader.hasError()) {
    const b = reader.nextByte();
    varInt = varInt | ((b & 0x7f) << (7 * idx));
    if ((b & 0x80) === 0) {
      break;
    }
    if (idx >= 10) {
      // Varint can be between 1 and 10 bytes. This is too large.
      reader.error = true;
      break;
    }
    idx++;
  }

  return varInt;
}

// Attempt to taste a full Google Protobuf message.
function readProtoMessage(reader: Reader): boolean {
  const varInt = readProtoVarInt(reader);
  const wireType = varInt & 0x7;

  switch (wireType) {
    case 0:
      readProtoVarInt(reader);
      return true;
    case 1:
      reader.next(8);
      return true;
    case 2:
      const len = readProtoVarInt(reader);
      reader.next(len);
      return true;
    case 5:
      reader.next(4);
      return true;
  }
  return false;
}

// Check whether this seems to be a valid protobuf file.
function isBinaryProto(fileBuffer: Buffer, totalBytes: number): boolean {
  const reader = new Reader(fileBuffer, totalBytes);
  let numMessages = 0;

  while (true) {
    // Definitely not a valid protobuf
    if (!readProtoMessage(reader) && !reader.hasError()) {
      return false;
    }
    // Short read?
    if (reader.hasError()) {
      break;
    }
    numMessages++;
  }

  return numMessages > 0;
}

export async function isBinaryFile(file: string | Buffer, size?: number): Promise<boolean> {
  if (isString(file)) {
    const stat = await statAsync(file);

    isStatFile(stat);

    const fileDescriptor = await openAsync(file, 'r');

    const allocBuffer = Buffer.alloc(READ_BUFFER_SIZE);

    // Read the file with no encoding for raw buffer access.
    // NB: something is severely wrong with promisify, had to construct my own Promise
    return new Promise((fulfill, reject) => {
      fs.read(fileDescriptor, allocBuffer, 0, READ_BUFFER_SIZE, 0, (err, bytesRead, _) => {
        closeAsync(fileDescriptor);
        if (err) {
          reject(err);
        } else {
          try {
            fulfill(isBinaryCheck(allocBuffer, bytesRead));
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  } else {
    if (size === undefined) {
      size = file.length;
    }
    return isBinaryCheck(file, size);
  }
}

export function isBinaryFileSync(file: string | Buffer, size?: number): boolean {
  if (isString(file)) {
    const stat = fs.statSync(file);

    isStatFile(stat);

    const fileDescriptor = fs.openSync(file, 'r');

    const allocBuffer = Buffer.alloc(READ_BUFFER_SIZE);

    const bytesRead = fs.readSync(fileDescriptor, allocBuffer, 0, READ_BUFFER_SIZE, 0);
    fs.closeSync(fileDescriptor);

    return isBinaryCheck(allocBuffer, bytesRead);
  } else {
    if (size === undefined) {
      size = file.length;
    }
    return isBinaryCheck(file, size);
  }
}

function isBinaryCheck(fileBuffer: Buffer, bytesRead: number): boolean {
  // empty file. no clue what it is.
  if (bytesRead === 0) {
    return false;
  }

  let suspiciousBytes = 0;
  const totalBytes = Math.min(bytesRead, MAX_BYTES);

  // UTF-8 BOM
  if (bytesRead >= 3 && fileBuffer[0] === 0xef && fileBuffer[1] === 0xbb && fileBuffer[2] === 0xbf) {
    return false;
  }

  // UTF-32 BOM
  if (
    bytesRead >= 4 &&
    fileBuffer[0] === 0x00 &&
    fileBuffer[1] === 0x00 &&
    fileBuffer[2] === 0xfe &&
    fileBuffer[3] === 0xff
  ) {
    return false;
  }

  // UTF-32 LE BOM
  if (
    bytesRead >= 4 &&
    fileBuffer[0] === 0xff &&
    fileBuffer[1] === 0xfe &&
    fileBuffer[2] === 0x00 &&
    fileBuffer[3] === 0x00
  ) {
    return false;
  }

  // GB BOM
  if (
    bytesRead >= 4 &&
    fileBuffer[0] === 0x84 &&
    fileBuffer[1] === 0x31 &&
    fileBuffer[2] === 0x95 &&
    fileBuffer[3] === 0x33
  ) {
    return false;
  }

  if (totalBytes >= 5 && fileBuffer.slice(0, 5).toString() === '%PDF-') {
    /* PDF. This is binary. */
    return true;
  }

  // UTF-16 BE BOM
  if (bytesRead >= 2 && fileBuffer[0] === 0xfe && fileBuffer[1] === 0xff) {
    return false;
  }

  // UTF-16 LE BOM
  if (bytesRead >= 2 && fileBuffer[0] === 0xff && fileBuffer[1] === 0xfe) {
    return false;
  }

  for (let i = 0; i < totalBytes; i++) {
    if (fileBuffer[i] === 0) {
      // NULL byte--it's binary!
      return true;
    } else if ((fileBuffer[i] < 7 || fileBuffer[i] > 14) && (fileBuffer[i] < 32 || fileBuffer[i] > 127)) {
      // UTF-8 detection with boundary check support
      let validUTF8 = false;

      // Detect UTF-8 sequence length from leading byte
      let expectedLength = 0;
      if (fileBuffer[i] >= 0xc0 && fileBuffer[i] <= 0xdf) {
        expectedLength = 2;
      } else if (fileBuffer[i] >= 0xe0 && fileBuffer[i] <= 0xef) {
        expectedLength = 3;
      } else if (fileBuffer[i] >= 0xf0 && fileBuffer[i] <= 0xf7) {
        expectedLength = 4;
      }

      if (expectedLength > 0) {
        // Check if we have enough bytes (may extend beyond totalBytes into bytesRead)
        const maxCheckLimit = Math.min(i + expectedLength, bytesRead);

        if (maxCheckLimit >= i + expectedLength) {
          let allContinuationBytesValid = true;

          // Validate continuation bytes (must be 0x80-0xbf)
          for (let j = 1; j < expectedLength; j++) {
            if (fileBuffer[i + j] < 0x80 || fileBuffer[i + j] > 0xbf) {
              allContinuationBytesValid = false;
              break;
            }
          }

          if (allContinuationBytesValid) {
            i += expectedLength - 1;
            validUTF8 = true;
          } else {
            // Skip first continuation byte to avoid double-counting
            i += 1;
          }
        }
      }

      if (validUTF8) {
        continue;
      }

      suspiciousBytes++;
      // Read at least 32 fileBuffer before making a decision
      if (i >= 32 && (suspiciousBytes * 100) / totalBytes > 10) {
        return true;
      }
    }
  }

  if ((suspiciousBytes * 100) / totalBytes > 10) {
    return true;
  }

  if (suspiciousBytes > 1 && isBinaryProto(fileBuffer, totalBytes)) {
    return true;
  }

  return false;
}

function isString(x: any): x is string {
  return typeof x === 'string';
}

function isStatFile(stat: fs.Stats): void {
  if (!stat.isFile()) {
    throw new Error(`Path provided was not a file!`);
  }
}
