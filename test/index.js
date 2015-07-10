var assert = require("assert");
var fs = require("fs");
var path = require("path");
var isBinaryFile = require("../index");

FIXTURE_PATH = "./test/fixtures";

describe('isBinaryFile', function() {
  it('should fail on a binary program', function() {
    assert(isBinaryFile(path.join(FIXTURE_PATH, "grep")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "grep"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "grep"));
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on an extensionless script', function() {
    assert(!isBinaryFile(path.join(FIXTURE_PATH, "perl_script")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "perl_script"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "perl_script"));
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a russian text', function() {
    assert(!isBinaryFile(path.join(FIXTURE_PATH, "russian_file.rst")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "russian_file.rst"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "russian_file.rst"));
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a PDF', function() {
    assert(isBinaryFile(path.join(FIXTURE_PATH, "HelloWorld.pdf")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "HelloWorld.pdf"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "HelloWorld.pdf"));
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a zero-byte file', function() {
    assert(!isBinaryFile(path.join(FIXTURE_PATH, "null_file.gif")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "null_file.gif"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "null_file.gif"));
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should not fail on a gif', function() {
    assert(isBinaryFile(path.join(FIXTURE_PATH, "trunks.gif")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "trunks.gif"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "trunks.gif"));
    assert(isBinaryFile(bytes, stat.size));
  });

  it('should not fail on some UTF8 lua file', function() {
    assert(!isBinaryFile(path.join(FIXTURE_PATH, "no.lua")));

    var bytes = fs.readFileSync(path.join(FIXTURE_PATH, "no.lua"));
    var stat = fs.lstatSync(path.join(FIXTURE_PATH, "no.lua"));
    assert(!isBinaryFile(bytes, stat.size));
  });

  it('should fail a directory', function() {
    assert(!isBinaryFile(path.join(FIXTURE_PATH, "dir")));
  });

  it('should fail a directory with async', function(done) {
    isBinaryFile(path.join(FIXTURE_PATH, "dir"), function(err, result) {
      assert(!err);
      assert(!result);
      done();
    });
  });

  it('should not fail with async', function(done) {
    assert.doesNotThrow(function() {
      isBinaryFile(path.join(FIXTURE_PATH, "trunks.gif"), function(err, result) {
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
