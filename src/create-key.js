const crypto = require('crypto')

const sha256 = function() {
    const data = Array.from(arguments)
    const hasher = crypto.createHash('sha256')

    data.forEach(item => hasher.update(item.toString()))
    return hasher.digest()
}

const createKey = function(password, len) {
    const hashLen = 32
    const loops = Math.ceil(len / hashLen) - 1
    let buffer = sha256(password, len)

    if (loops < 1)
        return buffer.slice(0, len)

    for (let i=0; i<loops; i++)
        buffer = Buffer.concat([buffer, sha256(buffer, i, password)])

    return Buffer.concat([sha256(buffer, password), buffer.slice(hashLen, len)])
}

module.exports = createKey
