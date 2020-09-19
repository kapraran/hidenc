const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

/**
 *
 * @param {fs.WriteStream} fstream
 * @param {Buffer} iv
 */
function injectIv(fstream, iv) {
  return new Promise((resolve, reject) => {
    fstream.write(iv, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

/**
 *
 * @param {fs.ReadStream} input
 * @param {fs.WriteStream} output
 * @param {crypto.Cipher} cipher
 * @param {boolean} compressed
 */
function encryptStream(input, output, cipher, compressed = false) {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip()
    const transformSteps = [cipher, output]

    if (compressed) transformSteps.unshift(gzip)

    const encryption = transformSteps.reduce((stream, step) => stream.pipe(step), input)

    encryption.on('finish', resolve)
    encryption.on('error', reject)
  })
}

/**
 *
 * @param {string|Buffer|URL} file
 * @param {Buffer} key
 * @param {object} options
 */
function encrypt(file, key, options = {}) {
  // merge options with the defaults
  options = Object.assign(
    {
      algorithm: 'aes-256-ctr',
      iv: null,
      extension: '.enc',
    },
    options
  )

  // set initialization vector
  const iv = options.iv === null ? crypto.randomBytes(16) : options.iv

  // init file streams and cipher
  const input = fs.createReadStream(file)
  const output = fs.createWriteStream(file + options.extension)
  const cipher = crypto.createCipheriv(options.algorithm, key, iv).setAutoPadding(true)

  // inject iv
  return injectIv(output, iv)
    .then(() => encryptStream(input, output, cipher))
    .then(() => {})
}

module.exports = encrypt
