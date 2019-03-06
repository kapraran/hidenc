const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

/**
 * 
 * @param {fs.WriteStream} fstream 
 * @param {Buffer} iv 
 */
const injectIv = function(fstream, iv) {
    return new Promise((resolve, reject) => {
        fstream.write(iv, err => {
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
 */
const encryptStream = function(input, output, cipher) {
    return new Promise((resolve, reject) => {
        const gzip = zlib.createGzip()

        // encrypt stream
        const encryption = input
            .pipe(gzip)
            .pipe(cipher)
            .pipe(output)

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
const encrypt = function(file, key, options={}) {
    // merge options with the defaults
    options = Object.assign({
        algorithm: 'aes-192-cbc',
        iv: null,
        extension: '.enc'
    }, options)

    // set initialization vector
    const iv = options.iv === null ? crypto.randomBytes(16): options.iv

    // init file streams and cipher
    const input = fs.createReadStream(file)
    const output = fs.createWriteStream(file + options.extension)
    const cipher = crypto.createCipheriv(options.algorithm, key, iv)

    // inject iv
    return injectIv(output, iv)
        .then(() => encryptStream(input, output, cipher))
        .then(() => {})
}

module.exports = encrypt
