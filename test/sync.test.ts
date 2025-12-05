import { isBinaryFileSync } from '../src/index';

import * as fs from 'fs';
import * as path from 'path';

const FIXTURE_PATH = './test/fixtures';

describe('sync', () => {
  it('should require size if bytes are given', () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'grep'));

    const result = isBinaryFileSync(bytes);

    expect(result).toBe(true);
  });

  it('should return true on a binary program, accepting path', () => {
    const file = path.join(FIXTURE_PATH, 'grep');

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it('should return true on a binary program, accepting bytes & size', () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'grep'));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, 'grep')).size;

    const result = isBinaryFileSync(bytes, size);

    expect(result).toBe(true);
  });

  it('should return false on a extensionless script, accepting path', () => {
    const file = path.join(FIXTURE_PATH, 'perl_script');

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it('should return false on a extensionless script, accepting bytes & size', () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'perl_script'));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, 'perl_script')).size;

    const result = isBinaryFileSync(bytes, size);

    expect(result).toBe(false);
  });

  it('should return false on a russian text', () => {
    const file = path.join(FIXTURE_PATH, 'russian_file.rst');

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it('should return false on a zero-byte image file', () => {
    const file = path.join(FIXTURE_PATH, 'null_file.gif');

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it('should return true on a gif', () => {
    const file = path.join(FIXTURE_PATH, 'trunks.gif');

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it('should return false on some UTF8 lua file', () => {
    const file = path.join(FIXTURE_PATH, 'no.lua');

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it('should boom on a directory', () => {
    const file = path.join(FIXTURE_PATH, 'dir');

    try {
      isBinaryFileSync(file);
    } catch (e: any) {
      expect(e.message).toBe('Path provided was not a file!');
    }
  });

  it('should boom on non-existent file', () => {
    const file = path.join(FIXTURE_PATH, 'blahblahblbahhhhhh');

    try {
      isBinaryFileSync(file);
    } catch (e: any) {
      expect(e.message).toBe("ENOENT: no such file or directory, stat 'test/fixtures/blahblahblbahhhhhh'");
    }
  });

  it('should return true on a PDF', () => {
    const file = path.join(FIXTURE_PATH, 'pdf.pdf');

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it('should return true on a tricky PDF that needs a header check', () => {
    const file = path.join(FIXTURE_PATH, 'test.pdf');

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it('should return false for non-UTF8 files', () => {
    const encodingDir = path.join(FIXTURE_PATH, 'encodings');
    const files = fs.readdirSync(encodingDir);

    files.forEach((file) => {
      if (!/big5/.test(file) && !/gb/.test(file) && !/kr/.test(file)) {
        expect(isBinaryFileSync(path.join(encodingDir, file))).toBe(false);
      }
    });
  });

  it('should return false on a protobuf.proto', () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on a protobuf.proto.txt', () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return true on a protobuf.proto.bin', () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto.bin');
    const result = isBinaryFileSync(file);
    expect(result).toBe(true);
  });

  it('should return false on a Vai script file', () => {
    const file = path.join(FIXTURE_PATH, 'vai_script.txt');

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it('should not crash on malformed protobuf-like data (issue #80)', () => {
    const buff = Buffer.from(
      '82ACE2828045E382805FE1828053E7828045E7878045E8838145E2988445E2948545E2828D4CE2828A44E28280418CF7EC2E',
      'hex',
    );

    const result = isBinaryFileSync(buff);

    expect(typeof result).toBe('boolean');
  });

  it('should return false on a UTF-8 file with emoji', () => {
    const file = path.join(FIXTURE_PATH, 'emoji.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 508', () => {
    const file = path.join(FIXTURE_PATH, '508A-4byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 3-byte sequence truncated at byte 509', () => {
    const file = path.join(FIXTURE_PATH, '509A-3byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 509', () => {
    const file = path.join(FIXTURE_PATH, '509A-4byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 2-byte sequence truncated at byte 510', () => {
    const file = path.join(FIXTURE_PATH, '510A-2byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 3-byte sequence truncated at byte 510', () => {
    const file = path.join(FIXTURE_PATH, '510A-3byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 510', () => {
    const file = path.join(FIXTURE_PATH, '510A-4byte.txt');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });

  it('should return false on real-world Python file with UTF-8 at boundary (utf8-boundary-truncation bug case)', () => {
    const file = path.join(FIXTURE_PATH, 'utf8-boundary-truncation_case.py');
    const result = isBinaryFileSync(file);
    expect(result).toBe(false);
  });
});
