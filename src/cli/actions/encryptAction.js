const Action = require('./action')
const iutils = require('../input-utils')
const encrypt = require('../../encrypt')
const { createKey } = require('../../create-key')

class EncryptAction extends Action {
  validateInput(file, password, options) {
    return Promise.all([
      iutils.validateFile(file),
      iutils.validatePassword(password),
      iutils.validateExtension(options.ext),
    ])
  }

  action([file, password, ext]) {
    const key = createKey(password, 32)

    this.spinner.text = `Encrypting file: ${file}`
    return encrypt(file, key, {
      extension: ext,
    })
  }
}

module.exports = EncryptAction
