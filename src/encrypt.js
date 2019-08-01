var utils = require("./utils")
var encryptor = require("file-encryptor")

module.exports = function(file, key) {
  if (!utils.fileExists(file)) return utils.error('No such file "%s"', [file])

  var output = file + "." + utils.ENCR_EXT

  encryptor.encryptFile(file, output, key, { algorithm: "aes256" }, function(err) {
    if (err) return utils.error(err.message)

    utils.info('File "%s" encrypted successfully', [file], {
      input: file,
      output: output,
      key: key
    })
  })
}
