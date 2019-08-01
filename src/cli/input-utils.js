const path = require('path')
const fs = require('fs')
const util = require('util')

const fsMkdir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.exists)

/**
 *
 * @param {string} dirpath
 */
const mkdirp = function(dirpath) {
  const segments = path.posix.resolve(dirpath).split('/')
  let promise = Promise.resolve()

  for (let end = 2; end <= segments.length; end++) {
    const tmpDirpath = segments.slice(0, end).join('/')

    // chain promises
    promise = promise
      .then(() => fsExists(tmpDirpath))
      .then((exists) => (exists ? 1 : fsMkdir(tmpDirpath)))
  }

  return promise
}

/**
 *
 * @param {string} ext
 */
const validateExtension = function(ext) {
  ext = ext.trim()
  ext = ext[0] != '.' ? `.${ext}` : ext

  return ext.length > 1 ? ext : '.enc'
}

module.exports = {
  validateExtension,
  mkdirp,
}
