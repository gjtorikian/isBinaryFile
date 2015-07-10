var assert = require("assert");
var fs = require("fs");
var isBinaryFile = require("../index");

describe('isBinaryFile', function() {
  it('should fail on a binary program', function() {
    assert(isBinaryFile("./test/fixtures/grep"));

    var bytes = fs.readFileSync("./test/fixtures/grep");
    var stat = fs.lstatSync("./test/fixtures/grep");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on an extensionless script', function() {
    assert(!isBinaryFile("./test/fixtures/perl_script"));

    var bytes = fs.readFileSync("./test/fixtures/perl_script");
    var stat = fs.lstatSync("./test/fixtures/perl_script");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a russian text', function() {
    assert(!isBinaryFile("./test/fixtures/russian_file.rst"));

    var bytes = fs.readFileSync("./test/fixtures/russian_file.rst");
    var stat = fs.lstatSync("./test/fixtures/russian_file.rst");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a PDF', function() {
    assert(isBinaryFile("./test/fixtures/HelloWorld.pdf"));

    var bytes = fs.readFileSync("./test/fixtures/HelloWorld.pdf");
    var stat = fs.lstatSync("./test/fixtures/HelloWorld.pdf");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a zero-byte file', function() {
    assert(!isBinaryFile("./test/fixtures/null_file.gif"));

    var bytes = fs.readFileSync("./test/fixtures/null_file.gif");
    var stat = fs.lstatSync("./test/fixtures/null_file.gif");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a gif', function() {
    assert(isBinaryFile("./test/fixtures/trunks.gif"));

    var bytes = fs.readFileSync("./test/fixtures/trunks.gif");
    var stat = fs.lstatSync("./test/fixtures/trunks.gif");
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on some UTF8 lua file', function() {
    assert(!isBinaryFile("./test/fixtures/no.lua"));

    var bytes = fs.readFileSync("./test/fixtures/no.lua");
    var stat = fs.lstatSync("./test/fixtures/no.lua");
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should fail a directory', function() {
    assert(!isBinaryFile("./test/fixtures/dir"));
  });

  it('should fail a directory with async', function(done) {
    isBinaryFile("./test/fixtures/dir", function(err, result) {
      assert(!err);
      assert(!result);
      done();
    });
  });

  it('should not fail with async', function(done) {
    assert.doesNotThrow(function() {
      isBinaryFile("./test/fixtures/trunks.gif", function(err, result) {
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
