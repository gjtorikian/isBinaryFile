import { isBinaryFile, isBinaryFileSync } from '../src/index';

import * as fs from 'fs';
import {promises as fsPromises} from 'fs';
import * as path from 'path';

const FIXTURE_PATH = "./test/fixtures";

describe('async', () => {
  it("does not require size if bytes are given", async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));

    expect.assertions(1);

    const result = await isBinaryFile(bytes);

    expect(result).toBe(true);
  });

  it("should return true on a binary program, accepting path", async () => {
    const file = path.join(FIXTURE_PATH, "grep");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it("should return true on a binary program, accepting bytes & size", async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, "grep")).size;

    expect.assertions(1);

    const result = await isBinaryFile(bytes, size);

    expect(result).toBe(true);
  });

  it("should return false on a extensionless script, accepting path", async () => {
    const file = path.join(FIXTURE_PATH, "perl_script");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should return false on a extensionless script, accepting bytes & size", async () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "perl_script"));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, "perl_script")).size;

    expect.assertions(1);

    const result = await isBinaryFile(bytes, size);

    expect(result).toBe(false);
  });


  it("should return false on a russian text", async () => {
    const file = path.join(FIXTURE_PATH, "russian_file.rst");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should return false on a zero-byte image file", async () => {
    const file = path.join(FIXTURE_PATH, "null_file.gif");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should return true on a gif", async () => {
    const file = path.join(FIXTURE_PATH, "trunks.gif");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it("should return false on some UTF8 lua file", async () => {
    const file = path.join(FIXTURE_PATH, "no.lua");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should boom on a directory", async () => {
    const file = path.join(FIXTURE_PATH, "dir");

    expect.assertions(1);

    await expect(isBinaryFile(file)).rejects.toThrow("Path provided was not a file!");
  });

  it("should boom on non-existent file", async () => {
    const file = path.join(FIXTURE_PATH, "blahblahblbahhhhhh");

    expect.assertions(1);

    await expect(isBinaryFile(file)).rejects.toThrow("ENOENT: no such file or directory, stat 'test/fixtures/blahblahblbahhhhhh'");
  });

  it("should return true on a PDF", async () => {
    const file = path.join(FIXTURE_PATH, "pdf.pdf");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it("should return true on a tricky PDF that needs a header check", async () => {
    const file = path.join(FIXTURE_PATH, "test.pdf");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

  it("should return false on a protobuf.proto", async () => {
    const file = path.join(FIXTURE_PATH, "protobuf.proto");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should return false on a protobuf.proto.txt", async () => {
    const file = path.join(FIXTURE_PATH, "protobuf.proto.txt");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(false);
  });

  it("should return true on a protobuf.proto.bin", async () => {
    const file = path.join(FIXTURE_PATH, "protobuf.proto.bin");

    expect.assertions(1);

    const result = await isBinaryFile(file);

    expect(result).toBe(true);
  });

});

describe('sync', () => {
  it("should require size if bytes are given", () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));

    const result = isBinaryFileSync(bytes);

    expect(result).toBe(true);
  });

  it("should return true on a binary program, accepting path", () => {
    const file = path.join(FIXTURE_PATH, "grep");

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it("should return true on a binary program, accepting bytes & size", () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, "grep")).size;

    const result = isBinaryFileSync(bytes, size);

    expect(result).toBe(true);
  });

  it("should return false on a extensionless script, accepting path", () => {
    const file = path.join(FIXTURE_PATH, "perl_script");

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it("should return false on a extensionless script, accepting bytes & size", () => {
    const bytes = fs.readFileSync(path.join(FIXTURE_PATH, "perl_script"));
    const size = fs.lstatSync(path.join(FIXTURE_PATH, "perl_script")).size;

    const result = isBinaryFileSync(bytes, size);

    expect(result).toBe(false);
  });


  it("should return false on a russian text", () => {
    const file = path.join(FIXTURE_PATH, "russian_file.rst");

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it("should return false on a zero-byte image file", () => {
    const file = path.join(FIXTURE_PATH, "null_file.gif");

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it("should return true on a gif", () => {
    const file = path.join(FIXTURE_PATH, "trunks.gif");

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it("should return false on some UTF8 lua file", () => {
    const file = path.join(FIXTURE_PATH, "no.lua");

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });

  it("should boom on a directory", () => {
    const file = path.join(FIXTURE_PATH, "dir");

    try {
      isBinaryFileSync(file);
    } catch (e) {
      expect(e.message).toBe("Path provided was not a file!")
    }
  });

  it("should boom on non-existent file", () => {
    const file = path.join(FIXTURE_PATH, "blahblahblbahhhhhh");

    try {
      isBinaryFileSync(file);
    } catch (e) {
      expect(e.message).toBe("ENOENT: no such file or directory, stat 'test/fixtures/blahblahblbahhhhhh'")
    }
  });

  it("should return true on a PDF", () => {
    const file = path.join(FIXTURE_PATH, "pdf.pdf");

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it("should return true on a tricky PDF that needs a header check", () => {
    const file = path.join(FIXTURE_PATH, "test.pdf");

    const result = isBinaryFileSync(file);

    expect(result).toBe(true);
  });

  it("should return false for non-UTF8 files", async () => {
    const encodingDir = path.join(FIXTURE_PATH, "encodings")
    const files = fs.readdirSync(encodingDir);

    files.forEach((file) => {
      if (!/big5/.test(file) && !/gb/.test(file) && !/kr/.test(file)){
        expect(isBinaryFileSync(path.join(encodingDir, file))).toBe(false);
      }
    });
  });

  it("should return false for charset=iso-8859-1 files", async () => {
    const file = path.join(FIXTURE_PATH, "8859_1.txt");

    const result = isBinaryFileSync(file);

    expect(result).toBe(false);
  });
});
