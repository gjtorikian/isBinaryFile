var assert = require("assert");
var fs = require("fs");
var isBinaryFile = require("../index");

describe('isBinaryFile', function() {
  it('should fail on a binary program', function() {
    assert(isBinaryFile("./test/fixtures/01_grep"));

    var bytes = fs.readFileSync("./test/fixtures/01_grep");
    var stat = fs.lstatSync("./test/fixtures/01_grep");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on an extensionless script', function() {
    assert(!isBinaryFile("./test/fixtures/02_perl_script"));

    var bytes = fs.readFileSync("./test/fixtures/02_perl_script");
    var stat = fs.lstatSync("./test/fixtures/02_perl_script");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a russian text', function() {
    assert(!isBinaryFile("./test/fixtures/03_russian_file.rst"));

    var bytes = fs.readFileSync("./test/fixtures/03_russian_file.rst");
    var stat = fs.lstatSync("./test/fixtures/03_russian_file.rst");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a PDF', function() {
    assert(isBinaryFile("./test/fixtures/04_HelloWorld.pdf"));

    var bytes = fs.readFileSync("./test/fixtures/04_HelloWorld.pdf");
    var stat = fs.lstatSync("./test/fixtures/04_HelloWorld.pdf");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a zero-byte file', function() {
    assert(!isBinaryFile("./test/fixtures/05_null_file.gif"));

    var bytes = fs.readFileSync("./test/fixtures/05_null_file.gif");
    var stat = fs.lstatSync("./test/fixtures/05_null_file.gif");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a gif', function() {
    assert(isBinaryFile("./test/fixtures/06_trunks.gif"));

    var bytes = fs.readFileSync("./test/fixtures/06_trunks.gif");
    var stat = fs.lstatSync("./test/fixtures/06_trunks.gif");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on some UTF8 lua file', function() {
    assert(!isBinaryFile("./test/fixtures/07_no.lua"));

    var bytes = fs.readFileSync("./test/fixtures/07_no.lua");
    var stat = fs.lstatSync("./test/fixtures/07_no.lua");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should fail a directory', function() {
    assert(!isBinaryFile("./test/fixtures/08_dir"));
  });

  it('should fail a directory with async', function(done) {
    isBinaryFile("./test/fixtures/08_dir", function(err, result) {
      assert(!err);
      assert(!result);
      done();
    });
  });

  it('should not fail with async', function(done) {
    assert.doesNotThrow(function() {
      isBinaryFile("./test/fixtures/06_trunks.gif", function(err, result) {
        assert(!err);
        assert(result);
        done();
      }, function(err) {
        if (err) throw err;
        done();
      });
    });
  });
});
