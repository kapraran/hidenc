var utils = require('./utils');
var encryptor = require('file-encryptor');

module.exports = function(file, key) {
    var input = file;
    var output = null;

    if (!utils.fileExists(input)) {
        input += '.' + utils.ENCR_EXT;

            if (!utils.fileExists(input))
                return utils.error('No such file "%s"', [file]);
    }

    if (utils.extEquals(input, utils.ENCR_EXT)) {
        var parsed = utils.parseFile(input);

        if (parsed.length > 1)
            output = parsed[0];
    } else if (input != file) {
        output = file;
    } else {
        var parsed = utils.parseFile(file);

        if (parsed.length > 1)
            output = parsed[0] + '.decr.' + parsed[1];
    }

    if (!output)
        output = file + '.' + utils.DECR_EXT;

    encryptor.decryptFile(input, output, key, {algorithm: 'aes256'}, function(err) {
        if (err)
            return utils.error(err.message);

        utils.info('File "%s" decrypted successfully', [file], {
            "input": input,
            "output": output,
            "key": key
        });
    });
}