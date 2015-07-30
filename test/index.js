var assert = require("assert");
var fs = require("fs");
var path = require("path");
var isBinaryFile = require("../index");

var FIXTURE_PATH = "./test/fixtures";

describe('isBinaryFile()', function() {
  it('should return true on a binary program', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "grep"), function (err, result) {
      assert(result);
      cb();
    });
  });

  it('should return false on an extensionless script', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "perl_script"), function (err, result) {
      assert(!result);
      cb();
    });
  });

  it('should return false on a russian text', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "russian_file.rst"), function (err, result) {
      assert(!result);
      cb();
    });
  });

  it('should return false on a zero-byte image file', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "null_file.gif"), function (err, result) {
      assert(!result);
      cb();
    });
  });

  it('should return true on a gif', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "trunks.gif"), function (err, result) {
      assert(result);
      cb();
    });
  });

  it('should return false on some UTF8 lua file', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "no.lua"), function (err, result) {
      assert(!result);
      cb();
    });
  });

  it('should return false on a directory', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "dir"), function (err, result) {
      assert(!err);
      assert(!result);
      cb();
    });
  });

  it('should return true on a PDF', function(cb) {
    isBinaryFile(path.join(FIXTURE_PATH, "pdf.pdf"), function (err, result) {
      assert(result);
      cb();
    });
  });
});

describe('isBinaryFile.sync()', function() {
  it('should return true on a binary program', function() {
    assert(isBinaryFile.sync(path.join(FIXTURE_PATH, "grep")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "grep"));
    assert(isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false on an extensionless text script', function() {
    assert(!isBinaryFile.sync(path.join(FIXTURE_PATH, "perl_script")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "perl_script"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "perl_script"));
    assert(!isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false on a russian text', function() {
    assert(!isBinaryFile.sync(path.join(FIXTURE_PATH, "russian_file.rst")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "russian_file.rst"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "russian_file.rst"));
    assert(!isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false on a zero-byte image file', function() {
    assert(!isBinaryFile.sync(path.join(FIXTURE_PATH, "null_file.gif")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "null_file.gif"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "null_file.gif"));
    assert(!isBinaryFile.sync(bytes, stat.size));
  });

  it('should return true on a gif', function() {
    assert(isBinaryFile.sync(path.join(FIXTURE_PATH, "trunks.gif")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "trunks.gif"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "trunks.gif"));
    assert(isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false on some UTF8 lua file', function() {
    assert(!isBinaryFile.sync(path.join(FIXTURE_PATH, "no.lua")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "no.lua"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "no.lua"));
    assert(!isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false on a directory', function() {
    assert(!isBinaryFile.sync(path.join(FIXTURE_PATH, "dir")));
  });

  it('should return true on a PDF', function() {
    assert(isBinaryFile.sync(path.join(FIXTURE_PATH, "pdf.pdf")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "pdf.pdf"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "pdf.pdf"));
    assert(isBinaryFile.sync(bytes, stat.size));
  });

  it('should return false for non-UTF8 files', function() {
    encoding_dir = path.join(FIXTURE_PATH, "encodings")
    files = fs.readdirSync(encoding_dir);
    files.forEach(function(file) {
      if (!/big5/.test(file) && !/gb/.test(file) && !/kr/.test(file))
        assert(!isBinaryFile.sync(path.join(encoding_dir, file)));
    });
  });
});
