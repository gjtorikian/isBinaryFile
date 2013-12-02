"mocha";

var assert = require("assert");
var fs = require("fs");
var isBinaryFile = require("../index").isBinaryFile;
var isBinaryFileSync = require("../index").isBinaryFileSync;

describe('isBinaryFile', function() {
    it('should fail on a binary program', function() {
      assert(isBinaryFileSync("tests/fixtures/01_grep"));

      isBinaryFile("tests/fixtures/01_grep", function (err, isBinary) {
        assert(!err);
        assert(isBinary);
      });
    });

    it('should not fail on an extensionless script', function() {
      assert(!isBinaryFileSync("tests/fixtures/02_perl_script"));

      isBinaryFile("tests/fixtures/02_perl_script", function (err, isBinary) {
        assert(!err);
        assert(!isBinary);
      });
    });

    it('should not fail on a russian text', function() {
      assert(!isBinaryFileSync("tests/fixtures/03_Руководство_по_эксплуатации.rst"));
      
      isBinaryFile("tests/fixtures/03_Руководство_по_эксплуатации.rst", function (err, isBinary) {
        assert(!err);
        assert(!isBinary);
      });
    });

    it('should not fail on a PDF', function() {
      assert(isBinaryFileSync("tests/fixtures/04_HelloWorld.pdf"));

      var bytes = fs.readFileSync("tests/fixtures/04_HelloWorld.pdf");
      isBinaryFile("tests/fixtures/04_HelloWorld.pdf", function (err, isBinary) {
        assert(!err);
        assert(isBinary);
      });
    });

    it('should not fail on a zero-byte file', function() {
      assert(!isBinaryFileSync("tests/fixtures/05_null_file.gif"));

      isBinaryFile("tests/fixtures/05_null_file.gif", function (err, isBinary) {
        assert(!err);
        assert(!isBinary);
      });
    });

    it('should not fail on a gif', function() {
      assert(isBinaryFileSync("tests/fixtures/06_trunks.gif"));
      
      isBinaryFile("tests/fixtures/06_trunks.gif", function (err, isBinary) {
        assert(!err);
        assert(isBinary);
      });
    });
});
