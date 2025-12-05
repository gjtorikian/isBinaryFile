import { isBinaryFile, isBinaryFileSync } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

const FIXTURE_PATH = './test/fixtures';
const ENCODING_PATH = path.join(FIXTURE_PATH, 'encodings');

describe('encoding hints', () => {
  describe('options API', () => {
    it('should work with no options', () => {
      const result = isBinaryFileSync(path.join(FIXTURE_PATH, 'grep'));
      expect(result).toBe(true);
    });

    it('should work with options object containing size', () => {
      const bytes = fs.readFileSync(path.join(FIXTURE_PATH, 'grep'));
      const result = isBinaryFileSync(bytes, { size: bytes.length });
      expect(result).toBe(true);
    });
  });

  describe('UTF-16 without BOM', () => {
    it('should auto-detect UTF-16LE without BOM as text', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'utf16le-no-bom.txt'));
      expect(result).toBe(false);
    });

    it('should auto-detect UTF-16BE without BOM as text', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'utf16be-no-bom.txt'));
      expect(result).toBe(false);
    });

    it('should detect UTF-16LE text with utf-16le hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'utf16le-no-bom.txt'), { encoding: 'utf-16le' });
      expect(result).toBe(false);
    });

    it('should detect UTF-16BE text with utf-16be hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'utf16be-no-bom.txt'), { encoding: 'utf-16be' });
      expect(result).toBe(false);
    });

    it('should detect UTF-16 text with generic utf-16 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'utf16le-no-bom.txt'), { encoding: 'utf-16' });
      expect(result).toBe(false);
    });
  });

  describe('Latin-1 / ISO-8859-1', () => {
    it('should detect test-latin.txt as text with latin1 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'test-latin.txt'), { encoding: 'latin1' });
      expect(result).toBe(false);
    });

    it('should detect test-latin.txt as text with iso-8859-1 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'test-latin.txt'), { encoding: 'iso-8859-1' });
      expect(result).toBe(false);
    });

    it('should still detect binary files as binary even with latin1 hint', () => {
      const result = isBinaryFileSync(path.join(FIXTURE_PATH, 'grep'), { encoding: 'latin1' });
      expect(result).toBe(true);
    });
  });

  describe('CJK encodings', () => {
    it('should detect big5.txt as text with big5 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'big5.txt'), { encoding: 'big5' });
      expect(result).toBe(false);
    });

    it('should detect big5_B.txt as text with big5 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'big5_B.txt'), { encoding: 'big5' });
      expect(result).toBe(false);
    });

    it('should detect test-gb.txt as text with gb2312 hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'test-gb.txt'), { encoding: 'gb2312' });
      expect(result).toBe(false);
    });

    it('should detect test-gb2.txt as text with gbk hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'test-gb2.txt'), { encoding: 'gbk' });
      expect(result).toBe(false);
    });

    it('should detect test-kr.txt as text with euc-kr hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'test-kr.txt'), { encoding: 'euc-kr' });
      expect(result).toBe(false);
    });

    it('should detect CJK files as text with generic cjk hint', () => {
      const result = isBinaryFileSync(path.join(ENCODING_PATH, 'big5.txt'), { encoding: 'cjk' });
      expect(result).toBe(false);
    });

    it('should still detect binary files as binary even with cjk hint', () => {
      const result = isBinaryFileSync(path.join(FIXTURE_PATH, 'grep'), { encoding: 'cjk' });
      expect(result).toBe(true);
    });
  });

  describe('async API with encoding hints', () => {
    it('should work with async API and encoding hints', async () => {
      const result = await isBinaryFile(path.join(ENCODING_PATH, 'big5.txt'), { encoding: 'big5' });
      expect(result).toBe(false);
    });

    it('should auto-detect UTF-16 with async API', async () => {
      const result = await isBinaryFile(path.join(ENCODING_PATH, 'utf16le-no-bom.txt'));
      expect(result).toBe(false);
    });
  });
});
