const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const stream = require('stream')

const fsStat = util.promisify(fs.stat)
const fsUnlink = util.promisify(fs.unlink)
const cryptoRandomBytes = util.promisify(crypto.randomBytes)

/**
 *
 * @param {int} streamSize
 */
const createRandomBytesStream = function(streamSize) {
  let producedBytes = 0

  return new stream.Readable({
    read(readSize) {
      readSize = Math.min(readSize, streamSize - producedBytes)
      producedBytes += readSize

      cryptoRandomBytes(readSize)
        .then((buffer) => {
          this.push(buffer)

          if (producedBytes >= streamSize) this.push(null)
        })
        .catch((err) => this.emmit('error', err))
    },
  })
}

/**
 *
 * @param {*} file
 * @param {int} size
 */
const overwriteFile = function(file, size) {
  return new Promise((resolve, reject) => {
    const randStream = createRandomBytesStream(size)
    const output = fs.createWriteStream(file)

    randStream.pipe(output)
    output.end(() => resolve())
  })
}

/**
 *
 * @param {string} file
 * @param {int} passes
 */
const remove = function(file, passes) {
  fsStat(file)
    .then((stats) => {
      const size = stats.size
      let promise = Promise.resolve()

      for (let p = 0; p < passes; p++) promise = promise.then(overwriteFile(file, size))

      return promise
    })
    .then(() => fsUnlink(file))
    .then(() => {
      console.log('OK')
    })
    .catch(console.error)
}

module.exports = remove
