const Action = require('./action')
const iutils = require('../input-utils')
const decrypt = require('../../decrypt')
const { createKey } = require('../../create-key')

class DecryptAction extends Action {
  validateInput(file, password, options) {
    return Promise.all([
      iutils.validateFile(file),
      iutils.validatePassword(password),
      iutils.validateExtension(options.ext),
    ])
  }

  action([file, password, ext]) {
    const key = createKey(password, 32)

    console.log(`[info] Decrypting file: ${file}`)
    return decrypt(file, key, {
      extension: ext,
    })
  }

  onError(err) {
    console.error(`Decryption failed. Try another password...`)
  }
}

module.exports = DecryptAction
