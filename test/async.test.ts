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

    const result = await isBinaryFile(bytes, { size });

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

    const result = await isBinaryFile(bytes, { size });

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

  it('should not crash on UTF-8 Chinese text buffer (issue #81)', async () => {
    const chars = [
      0xe9, 0xa2, 0x98, 0xe7, 0x9b, 0xae, 0x20, 0x20, 0x0a, 0xe2, 0x80, 0x9c, 0x37, 0x35, 0x35, 0x20,
      0xe5, 0xb9, 0xb4, 0xe6, 0x96, 0xad, 0xe8, 0xa3, 0x82, 0xe8, 0xae, 0xba, 0xe2, 0x80, 0x9d, 0xef,
      0xbc, 0x9a, 0xe4, 0xb8, 0x80, 0xe6, 0xac, 0xa1, 0xe6, 0x8a, 0x8a, 0xe4, 0xb8, 0xad, 0xe5, 0x94,
      0x90, 0xe8, 0xa7, 0x86, 0xe4, 0xb8, 0xba, 0xe4, 0xb8, 0xad, 0xe5, 0x9b, 0xbd, 0xe8, 0xbf, 0x91,
      0xe4, 0xbb, 0xa3, 0xe5, 0x8f, 0xb2, 0xe5, 0xbc, 0x80, 0xe7, 0xab, 0xaf, 0xe7, 0x9a, 0x84, 0xe7,
      0xb3, 0xbb, 0xe7, 0xbb, 0x9f, 0xe8, 0xae, 0xba, 0xe8, 0xaf, 0x81, 0x0a, 0x0a, 0xe5, 0x89, 0xaf,
      0xe6, 0xa0, 0x87, 0xe9, 0xa2, 0x98, 0x20, 0x20, 0x0a, 0xe4, 0xbb, 0x8e, 0xe8, 0xb1, 0xa1, 0xe5,
      0xbe, 0x81, 0xe7, 0xa7, 0xa9, 0xe5, 0xba, 0x8f, 0xe5, 0xb4, 0xa9, 0xe6, 0xba, 0x83, 0xe5, 0x88,
      0xb0, 0xe6, 0x99, 0x9a, 0xe6, 0x9c, 0x9f, 0xe5, 0xb8, 0x9d, 0xe5, 0x9b, 0xbd, 0xe6, 0x8b, 0x9c,
      0xe5, 0x8d, 0xa0, 0xe5, 0xba, 0xad, 0xe5, 0x8c, 0x96, 0xe7, 0x9a, 0x84, 0xe7, 0x90, 0x86, 0xe8,
      0xae, 0xba, 0xe8, 0x80, 0x83, 0xe5, 0x8f, 0xa4, 0x0a, 0x0a, 0xe6, 0x91, 0x98, 0xe8, 0xa6, 0x81,
      0x20, 0x20, 0x0a, 0xe4, 0xbb, 0xa5, 0xe2, 0x80, 0x9c, 0xe7, 0xbb, 0x88, 0xe6, 0x9e, 0x81, 0xe6,
      0x8b, 0x85, 0xe4, 0xbf, 0x9d, 0xe7, 0x9a, 0x84, 0xe8, 0x84, 0xb1, 0xe8, 0x90, 0xbd, 0xe2, 0x80,
      0x9d, 0xe4, 0xb8, 0xba, 0xe6, 0xa0, 0xb8, 0xe5, 0xbf, 0x83, 0xe5, 0x88, 0xa4, 0xe5, 0x87, 0x86,
      0xef, 0xbc, 0x8c, 0xe6, 0x9c, 0xac, 0xe6, 0x96, 0x87, 0xe6, 0x8f, 0x90, 0xe5, 0x87, 0xba, 0xef,
      0xbc, 0x9a, 0x37, 0x35, 0x35, 0x20, 0xe5, 0xb9, 0xb4, 0xe5, 0xae, 0x89, 0xe5, 0x8f, 0xb2, 0xe4,
      0xb9, 0x8b, 0xe4, 0xb9, 0xb1, 0xe5, 0xb9, 0xb6, 0xe9, 0x9d, 0x9e, 0xe4, 0xbc, 0xa0, 0xe7, 0xbb,
      0x9f, 0xe6, 0x84, 0x8f, 0xe4, 0xb9, 0x89, 0xe4, 0xb8, 0x8a, 0xe7, 0x9a, 0x84, 0xe7, 0x8e, 0x8b,
      0xe6, 0x9c, 0x9d, 0xe5, 0x8d, 0xb1, 0xe6, 0x9c, 0xba, 0xef, 0xbc, 0x8c, 0xe8, 0x80, 0x8c, 0xe6,
      0x98, 0xaf, 0xe4, 0xb8, 0xad, 0xe5, 0x9b, 0xbd, 0xe6, 0x96, 0x87, 0xe6, 0x98, 0x8e, 0xe8, 0xb1,
      0xa1, 0xe5, 0xbe, 0x81, 0xe7, 0xa7, 0xa9, 0xe5, 0xba, 0x8f, 0xe7, 0x9a, 0x84, 0xe8, 0x87, 0xaa,
      0xe6, 0x9d, 0x80, 0xe7, 0x82, 0xb9, 0xef, 0xbc, 0x9b, 0xe5, 0xae, 0x8b, 0xe2, 0x80, 0x94, 0xe6,
      0xb8, 0x85, 0x20, 0x31, 0x31, 0x30, 0x30, 0x20, 0xe4, 0xbd, 0x99, 0xe5, 0xb9, 0xb4, 0xe4, 0xb9,
      0x83, 0xe4, 0xb8, 0x80, 0xe5, 0x85, 0xb7, 0xe5, 0x88, 0xb6, 0xe5, 0xba, 0xa6, 0xe4, 0xbb, 0x8d,
      0xe8, 0xbf, 0x90, 0xe4, 0xbd, 0x9c, 0xe3, 0x80, 0x81, 0xe5, 0x8d, 0xb4, 0xe5, 0xb7, 0xb2, 0xe5,
      0xa4, 0xb1, 0xe7, 0x94, 0x9f, 0xe6, 0x88, 0x90, 0xe5, 0x8a, 0x9b, 0xe7, 0x9a, 0x84, 0xe2, 0x80,
      0x9c, 0xe6, 0xb4, 0xbb, 0xe6, 0xad, 0xbb, 0xe4, 0xba, 0xba, 0xe5, 0xb8, 0x9d, 0xe5, 0x9b, 0xbd,
      0xe2, 0x80, 0x9d, 0xe3, 0x80, 0x82, 0xe8, 0xae, 0xba, 0xe6, 0x96, 0x87, 0xe7, 0xbb, 0xbc, 0xe5,
      0x90, 0x88, 0xe5, 0x8e, 0x86, 0xe5, 0x8f, 0xb2, 0xe7, 0xa4, 0xbe, 0xe4, 0xbc, 0x9a, 0xe5, 0xad,
      0xa6, 0xe3, 0x80, 0x81, 0xe7, 0xb2, 0xbe, 0xe7, 0xa5, 0x9e, 0xe5, 0x88, 0x86, 0xe6, 0x9e, 0x90,
      0xe4, 0xba, 0xba, 0xe7, 0xb1, 0xbb, 0xe5, 0xad, 0xa6, 0xe3, 0x80, 0x81, 0xe6, 0x94, 0xbf, 0xe6,
      0xb2, 0xbb, 0xe7, 0xa5, 0x9e, 0xe5, 0xad, 0xa6, 0xe4, 0xb8, 0x8e, 0xe6, 0x96, 0xb0, 0xe5, 0x88,
      0xb6, 0xe5, 0xba, 0xa6, 0xe4, 0xb8, 0xbb, 0xe4,
    ];
    const buff = Buffer.from(chars);

    expect.assertions(1);

    const result = await isBinaryFile(buff);

    expect(result).toBe(false);
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
      // Big5, GB, and Korean encodings require encoding hints to be detected as text.
      // See encoding-hints.test.ts for tests with encoding hints.
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
