const crypto = require('crypto')
const fs = require('fs')
const zlib = require('zlib')

const ivReader = function(file) {
    return new Promise((resolve, reject) => {
        const ivInput = fs.createReadStream(file, {end: 15})
        const data = []

        ivInput.on('data', chunk => data.push(chunk))
        ivInput.on('end', () => resolve(Buffer.concat(data)))
    })
}

const decrypt = function(file, key, algorithm='aes-192-cbc') {
    // init file streams
    const input = fs.createReadStream(file, {start: 16})
    const output = fs.createWriteStream(file + '.orig')

    ivReader(file).then(iv => {
        // init transformers
        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        const unzip = zlib.createUnzip()

        input
            .pipe(decipher)
            .pipe(unzip)
            .pipe(output)
    })
}

module.exports = decrypt
