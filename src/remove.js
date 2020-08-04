const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const stream = require('stream')

const fsStat = util.promisify(fs.stat)
const fsUnlink = util.promisify(fs.unlink)
const cryptoRandomBytes = util.promisify(crypto.randomBytes)

/**
 * Creates a fixed length stream of random bytes
 *
 * @param {int} streamSize
 */
function createRandomBytesStream(streamSize) {
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
 * Overwrites a files with the same amount of random bytes
 *
 * @param {*} file
 * @param {int} size
 */
function overwriteFile(file, size) {
  return new Promise((resolve, reject) => {
    const randStream = createRandomBytesStream(size)
    const output = fs.createWriteStream(file, { flags: 'w' })

    randStream.pipe(output)
    output.on('error', reject)
    output.on('finish', resolve)
  })
}

/**
 * Safely removes a file from the filesystem, overwriting it first using random bytes
 *
 * @param {string} file
 * @param {int} passes
 */
function remove(file, passes) {
  fsStat(file)
    .then((stats) => {
      const size = stats.size
      let promise = Promise.resolve()

      for (let p = 0; p < passes; p++) promise = promise.then(overwriteFile(file, size))

      return promise
    })
    .then(() => fsUnlink(file))
}

module.exports = remove
