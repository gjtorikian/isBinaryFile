import { isBinaryFile } from '../src/index';

import * as fs from 'fs';
import * as path from 'path';

const FIXTURE_PATH = './test/fixtures';

describe('async', () => {
  it('does not require size if bytes are given', async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'grep'));

    expect.assertions(1);

    const result = await isBinaryFile(bytes);

    expect(result).toBe(true);
  });

  it('should return true on a binary program, accepting path', async () => {
    const file = path.join(FIXTURE_PATH, 'grep');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it('should return true on a binary program, accepting bytes & size', async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'grep'));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, 'grep')).size;

    expect.assertions(1);

    const result = await isBinaryFile(bytes, size);

    expect(result).toBe(true);
  });

  it('should return false on a extensionless script, accepting path', async () => {
    const file = path.join(FIXTURE_PATH, 'perl_script');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return false on a extensionless script, accepting bytes & size', async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'perl_script'));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, 'perl_script')).size;

    expect.assertions(1);

    const result = await isBinaryFile(bytes, size);

    expect(result).toBe(false);
  });

  it('should return false on a russian text', async () => {
    const file = path.join(FIXTURE_PATH, 'russian_file.rst');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return false on a zero-byte image file', async () => {
    const file = path.join(FIXTURE_PATH, 'null_file.gif');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return true on a gif', async () => {
    const file = path.join(FIXTURE_PATH, 'trunks.gif');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it('should return false on some UTF8 lua file', async () => {
    const file = path.join(FIXTURE_PATH, 'no.lua');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should boom on a directory', async () => {
    const file = path.join(FIXTURE_PATH, 'dir');

    expect.assertions(1);

    await expect(isBinaryFile(file)).rejects.toThrow('Path provided was not a file!');
  });

  it('should boom on non-existent file', async () => {
    const file = path.join(FIXTURE_PATH, 'blahblahblbahhhhhh');

    expect.assertions(1);

    await expect(isBinaryFile(file)).rejects.toThrow(
      "ENOENT: no such file or directory, stat 'test/fixtures/blahblahblbahhhhhh'",
    );
  });

  it('should return true on a PDF', async () => {
    const file = path.join(FIXTURE_PATH, 'pdf.pdf');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it('should return true on a tricky PDF that needs a header check', async () => {
    const file = path.join(FIXTURE_PATH, 'test.pdf');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it('should return false on a protobuf.proto', async () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return false on a protobuf.proto.txt', async () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto.txt');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return true on a protobuf.proto.bin', async () => {
    const file = path.join(FIXTURE_PATH, 'protobuf.proto.bin');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it('should not crash on malformed protobuf-like data (issue #80)', async () => {
    const buff = Buffer.from(
      '82ACE2828045E382805FE1828053E7828045E7878045E8838145E2988445E2948545E2828D4CE2828A44E28280418CF7EC2E',
      'hex',
    );

    expect.assertions(1);

    const result = await isBinaryFile(buff);

    expect(typeof result).toBe('boolean');
  });

  it('should return false on a Vai script file', async () => {
    const file = path.join(FIXTURE_PATH, 'vai_script.txt');

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it('should return false for non-UTF8 files', async () => {
    const encodingDir = path.join(FIXTURE_PATH, 'encodings');
    const files = fs.readdirSync(encodingDir);

    for (const file of files) {
      if (!/big5/.test(file) && !/gb/.test(file) && !/kr/.test(file)) {
        expect(await isBinaryFile(path.join(encodingDir, file))).toBe(false);
      }
    }
  });

  it('should return false on a UTF-8 file with emoji', async () => {
    const file = path.join(FIXTURE_PATH, 'emoji.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 508', async () => {
    const file = path.join(FIXTURE_PATH, '508A-4byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 3-byte sequence truncated at byte 509', async () => {
    const file = path.join(FIXTURE_PATH, '509A-3byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 509', async () => {
    const file = path.join(FIXTURE_PATH, '509A-4byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 2-byte sequence truncated at byte 510', async () => {
    const file = path.join(FIXTURE_PATH, '510A-2byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 3-byte sequence truncated at byte 510', async () => {
    const file = path.join(FIXTURE_PATH, '510A-3byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on UTF-8 file with 4-byte sequence truncated at byte 510', async () => {
    const file = path.join(FIXTURE_PATH, '510A-4byte.txt');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });

  it('should return false on real-world Python file with UTF-8 at boundary (utf8-boundary-truncation bug case)', async () => {
    const file = path.join(FIXTURE_PATH, 'utf8-boundary-truncation_case.py');
    const result = await isBinaryFile(file);
    expect(result).toBe(false);
  });
});
