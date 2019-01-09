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

const encryptFileStream = function(input, output, cipher) {

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

    // init file streams
    const input = fs.createReadStream(file)
    const output = fs.createWriteStream(file + options.extension)

    // init transformers
    const cipher = crypto.createCipheriv(options.algorithm, key, iv)
    const gzip = zlib.createGzip()

    // inject iv
    return injectIv(output, iv)
        .then(() => {
            // encrypt file
            input
                .pipe(gzip)
                .pipe(cipher)
                .pipe(output)
        })
}

module.exports = encrypt
