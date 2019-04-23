const Action = require('./action')
const iutils = require('../input-utils')
const remove = require('../../remove')

class RemoveAction extends Action {
  validateInput(file, options) {
    return Promise.all([
      iutils.validateFile(file),
      iutils.validatePasses(options.passes)
    ])
  }

  action([file, passes]) {
    console.log(`[info] Removing file: ${file}`)
    return remove(file, passes)
  }
}

module.exports = RemoveAction
