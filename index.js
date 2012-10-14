var fs = require('fs');

module.exports = function(file, statSize) {
	// Read the file with no encoding for raw buffer access.
	var bytes = fs.readFileSync(file); 
	var size = statSize || fs.statSync(file).size;
	var suspicious_bytes = 0;
	var total_bytes = size > 1024 ? 1024 : size;
	
	for (var i = 0; i < total_bytes; i++) {
    	if (bytes[i] == '\0') {
    		// NULL char. It's binary
            return 1;
        }
        else if ((bytes[i] < 7 || bytes[i] > 14) && (bytes[i] < 32 || bytes[i] > 127)) {
            suspicious_bytes++;

            // Disk IO is so slow that it's worthwhile to do this calculation after every suspicious byte.
            // This is true even on a 1.6Ghz Atom with an Intel 320 SSD.
            if ((suspicious_bytes * 100) / total_bytes > 10) {
                return 1;
            }
        }
	}
	return 0;
}