const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

/**
 * 
 * @param {string|Buffer|URL} file 
 */
const readIv = function(file) {
    return new Promise((resolve, reject) => {
        const ivInput = fs.createReadStream(file, {end: 15})
        const data = []

        ivInput.on('data', chunk => data.push(chunk))
        ivInput.on('end', () => resolve(Buffer.concat(data)))
    })
}

/**
 * 
 * @param {string|Buffer|URL} file 
 * @param {Buffer} key 
 * @param {object} options 
 */
const decrypt = function(file, key, options={}) {
    // merge options with the defaults
    options = Object.assign({
        algorithm: 'aes-192-cbc',
        iv: null,
        extension: '.dec'
    }, options)

    // init file streams
    const input = fs.createReadStream(file, {start: 16})
    const output = fs.createWriteStream(file + options.extension)

    readIv(file).then(iv => {
        // init transformers
        const decipher = crypto.createDecipheriv(options.algorithm, key, iv)
        const unzip = zlib.createUnzip()

        input
            .pipe(decipher)
            .pipe(unzip)
            .pipe(output)
    })
}

module.exports = decrypt
