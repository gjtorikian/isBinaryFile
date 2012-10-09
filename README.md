isBinaryFile
============

Detects if a file is binary in Node.js. Similar to [Perl's `-B` switch](http://stackoverflow.com/questions/899206/how-does-perl-know-a-file-is-binary), in that:

* it reads the first few bytes of a file
* checks for a `null` byte; if it's found, it's binary
* flags non-ASCII characters. After a certain number of "weird" characters, the file is flagged as binary

Please make sure the file exists before calling this function.

## Installation

```
npm install isBinaryFile
```

## Usage

```javascript
var isBinaryFile = require("isBinaryFile");

if (isBinaryFile(process.argv[2]))
	console.log("It is!")
else
	console.log("No.")
```

Ta da.