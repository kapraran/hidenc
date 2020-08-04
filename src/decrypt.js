const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

/**
 *
 * @param {string|Buffer|URL} file
 */
function readIv(file) {
  return new Promise((resolve, reject) => {
    const ivInput = fs.createReadStream(file, { end: 15 })
    const data = []

    ivInput.on('data', (chunk) => data.push(chunk))
    ivInput.on('end', () => resolve(Buffer.concat(data)))
  })
}

/**
 *
 * @param {fs.ReadStream} input
 * @param {fs.WriteStream} output
 * @param {crypto.Decipher} decipher
 */
function decryptStream(input, output, decipher) {
  return new Promise((resolve, reject) => {
    // init transformers
    const unzip = zlib.createUnzip()

    const decryption = input
      .pipe(decipher)
      .pipe(unzip)
      .pipe(output)

    decryption.on('finished', resolve)
    decryption.on('error', reject)
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
      algorithm: 'aes-192-cbc',
      iv: null,
      extension: '.dec',
    },
    options
  )

  // init file streams
  const input = fs.createReadStream(file, { start: 16 })
  const output = fs.createWriteStream(file + options.extension)

  return readIv(file).then((iv) => {
    // init decipher
    const decipher = crypto.createDecipheriv(options.algorithm, key, iv)
    return decryptStream(input, output, decipher)
  })
}

module.exports = decrypt
