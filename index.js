var fs = require('fs');

module.exports = function(bytes, size) {
    // Read the file with no encoding for raw buffer access.
    if (size === undefined) {
        bytes = fs.readFileSync(file);
        size = fs.statSync(file).size;
    } 

    var suspicious_bytes = 0;
    var total_bytes = size > 1024 ? 1024 : size;
    
    for (var i = 0; i < total_bytes; i++) {   
        if (bytes[i] == '0') {
            // NULL char. It's binary
            return true;
        }
        else if ((bytes[i] < 7 || bytes[i] > 14) && (bytes[i] < 32 || bytes[i] > 127)) {
            suspicious_bytes++;

            // Read at least 32 bytes before making a decision
            if (i > 32 && (suspicious_bytes * 100) / total_bytes > 20) {
                return true;
            }
        }
    }

    if ((suspicious_bytes * 100) / total_bytes > 20) {
        return true;
    }
    
    return false;
}