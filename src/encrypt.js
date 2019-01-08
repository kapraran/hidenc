const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

const encrypt = function(file, key, algorithm='aes-192-cbc', iv=null) {
    iv = iv === null ? iv = crypto.randomBytes(16): iv

    // init file streams
    const input = fs.createReadStream(file)
    const output = fs.createWriteStream(file + '.enc')

    // init transformers
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const gzip = zlib.createGzip()

    // inject iv
    output.write(iv, err => {
        if (err) throw err

        // encrypt file
        input
            .pipe(gzip)
            .pipe(cipher)
            .pipe(output)
    })
}

module.exports = encrypt
