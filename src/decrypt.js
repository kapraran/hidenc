const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

/**
 *
 * @param {string} filename
 * @param {string} defExtension
 */
function resolveExtension(filename, defExtension) {
  const results = filename.match(/^.+(\..*)\.enc$/)
  return results !== null ? results[1] : defExtension
}

/**
 *
 * @param {string|Buffer|URL} filepath
 */
function readIv(filepath) {
  return new Promise((resolve, reject) => {
    const ivInput = fs.createReadStream(filepath, { end: 15 })
    const data = []

    ivInput.on('data', (chunk) => data.push(chunk))
    ivInput.on('end', () => resolve(Buffer.concat(data)))
    ivInput.on('error', reject)
  })
}

/**
 *
 * @param {string|Buffer|URL} filepath
 * @param {number} fileSize
 */
function readTag(filepath, fileSize) {
  return new Promise((resolve, reject) => {
    const tagInput = fs.createReadStream(filepath, { start: fileSize - 16 })
    const data = []

    tagInput.on('data', (chunk) => data.push(chunk))
    tagInput.on('end', () => resolve(Buffer.concat(data)))
    tagInput.on('error', reject)
  })
}

/**
 *
 * @param {fs.ReadStream} input
 * @param {fs.WriteStream} output
 * @param {crypto.Decipher} decipher
 * @param {boolean} compressed
 */
function decryptStream(input, output, decipher, compressed = false) {
  return new Promise((resolve, reject) => {
    // init transformers
    const unzip = zlib.createUnzip()
    const transformSteps = [decipher, output]

    // add unzip if file is compressed
    if (compressed) transformSteps.splice(1, 0, unzip)

    const decryption = transformSteps.reduce((stream, step) => {
      step.removeAllListeners()
      step.on('error', reject)
      return stream.pipe(step)
    }, input)

    decryption.on('finish', resolve)
  })
}

/**
 *
 * @param {string|Buffer|URL} file
 * @param {Buffer} key
 * @param {object} options
 */
function decrypt(file, key, options = {}) {
  // merge options with the defaults
  options = Object.assign(
    {
      algorithm: 'aes-256-gcm',
      iv: null,
      extension: resolveExtension(file, '.dec'),
    },
    options
  )

  // init file streams
  const { size } = fs.statSync(file)
  const input = fs.createReadStream(file, { start: 16, end: size - 17 })
  const output = fs.createWriteStream(file + options.extension)

  return Promise.all([readIv(file), readTag(file, size)])
    .then(([iv, tag]) => {
      // init decipher
      const decipher = crypto.createDecipheriv(options.algorithm, key, iv).setAuthTag(tag)
      return decryptStream(input, output, decipher)
    })
    .then(() => file + options.extension)
}

module.exports = decrypt
