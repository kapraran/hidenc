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
        .catch((err) => this.emit('error', err))
    },
  })
}

/**
 * Overwrites a file with the same amount of random bytes
 *
 * @param {*} filepath
 * @param {int} size
 */
function overwriteFile(filepath, size) {
  return new Promise((resolve, reject) => {
    const randStream = createRandomBytesStream(size)
    const output = fs.createWriteStream(filepath, { flags: 'w' })

    randStream.pipe(output)
    output.on('error', reject)
    output.on('finish', resolve)
  })
}

/**
 * Safely removes a file from the filesystem, overwriting it first using random bytes
 *
 * @param {string} filepath
 * @param {int} passes
 */
function remove(filepath, passes) {
  return fsStat(filepath)
    .then(({ size }) => {
      let promise = Promise.resolve()

      for (let p = 0; p < passes; p++)
        promise = promise.then(() => overwriteFile(filepath, size))

      return promise
    })
    .then(() => fsUnlink(filepath))
}

module.exports = remove
