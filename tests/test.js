"mocha";

var assert = require("assert");
var fs = require("fs");
var isBinaryFile = require("../index");

describe('isBinaryFile', function() {
    it('should fail on a binary program', function() {
      assert(isBinaryFile("./fixtures/01_grep"));

      var bytes = fs.readFileSync("./fixtures/01_grep");
      var stat = fs.lstatSync("./fixtures/01_grep");
      assert(isBinaryFile(bytes, stat.size));
    });

    it('should not fail on an extensionless script', function() {
      assert(!isBinaryFile("./fixtures/02_perl_script"));

      var bytes = fs.readFileSync("./fixtures/02_perl_script");
      var stat = fs.lstatSync("./fixtures/02_perl_script");
      assert(!isBinaryFile(bytes, stat.size));
    });

    it('should not fail on a russian text', function() {
      assert(!isBinaryFile("./fixtures/03_Руководство_по_эксплуатации.rst"));
      
      var bytes = fs.readFileSync("./fixtures/03_Руководство_по_эксплуатации.rst");
      var stat = fs.lstatSync("./fixtures/03_Руководство_по_эксплуатации.rst");
      assert(!isBinaryFile(bytes, stat.size));
    });

    it('should not fail on a PDF', function() {
      assert(isBinaryFile("./fixtures/04_HelloWorld.pdf"));

      var bytes = fs.readFileSync("./fixtures/04_HelloWorld.pdf");
      var stat = fs.lstatSync("./fixtures/04_HelloWorld.pdf");
      assert(isBinaryFile(bytes, stat.size));
    });

    it('should not fail on a zero-byte file', function() {
      assert(!isBinaryFile("./fixtures/05_null_file.gif"));
      
      var bytes = fs.readFileSync("./fixtures/05_null_file.gif");
      var stat = fs.lstatSync("./fixtures/05_null_file.gif");
      assert(!isBinaryFile(bytes, stat.size));
    });

    it('should not fail on a gif', function() {
      assert(isBinaryFile("./fixtures/06_trunks.gif"));
      
      var bytes = fs.readFileSync("./fixtures/06_trunks.gif");
      var stat = fs.lstatSync("./fixtures/06_trunks.gif");
      assert(isBinaryFile(bytes, stat.size));
    });
});
