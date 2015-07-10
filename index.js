var fs = require('fs');
var path = require("path");
var max_bytes = 512;

module.exports = function(bytes, size) {
  var file = bytes;
  // Read the file with no encoding for raw buffer access.
  if (size === undefined) {
    try {
      if(!fs.statSync(file).isFile()) return false;
    } catch (err) {
      // otherwise continue on
    }
    var descriptor = fs.openSync(file, 'r');
    try {
      bytes = new Buffer(max_bytes);
      size = fs.readSync(descriptor, bytes, 0, bytes.length, 0);
    } finally {
      fs.closeSync(descriptor);
    }
  }
  // async version has a function instead of a `size`
  else if (typeof size === "function") {
    callback = size;
    fs.stat(file, function(err, stat) {
      if (err || !stat.isFile()) return callback(null, false);

      fs.open(file, 'r', function(err, descriptor){
          if (err) return callback(err);
          var bytes = new Buffer(max_bytes);
          // Read the file with no encoding for raw buffer access.
          fs.read(descriptor, bytes, 0, bytes.length, 0, function(err, size, bytes){
            fs.close(descriptor, function(err2){
                if (err || err2)
                    return callback(err || err2);
                return callback(null, isBinaryCheck(bytes, size));
            });
          });
      });
    });
  }

  return isBinaryCheck(bytes, size);
};

function isBinaryCheck(bytes, size) {
  if (size === 0)
    return false;

  var suspicious_bytes = 0;
  var total_bytes = Math.min(size, max_bytes);

  if (size >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) {
    // UTF-8 BOM. This isn't binary.
    return false;
  }

  if (total_bytes >= 4 && bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] ==  0x46) {
      /* PDF. This is binary. */
      return 1;
  }

  for (var i = 0; i < total_bytes; i++) {
    if (bytes[i] === 0) { // NULL byte--it's binary!
      return true;
    }
    else if ((bytes[i] < 7 || bytes[i] > 14) && (bytes[i] < 32 || bytes[i] > 127)) {
      // UTF-8 detection
      if (bytes[i] > 193 && bytes[i] < 224 && i + 1 < total_bytes) {
          i++;
          if (bytes[i] > 127 && bytes[i] < 192) {
              continue;
          }
      }
      else if (bytes[i] > 223 && bytes[i] < 240 && i + 2 < total_bytes) {
          i++;
          if (bytes[i] > 127 && bytes[i] < 192 && bytes[i + 1] > 127 && bytes[i + 1] < 192) {
              i++;
              continue;
          }
      }
      suspicious_bytes++;
      // Read at least 32 bytes before making a decision
      if (i > 32 && (suspicious_bytes * 100) / total_bytes > 10) {
          return true;
      }
    }
  }

  if ((suspicious_bytes * 100) / total_bytes > 10) {
    return true;
  }

  return false;
}

module.exports.isBinaryCheck = isBinaryCheck;
