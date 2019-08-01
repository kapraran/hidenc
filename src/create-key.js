const crypto = require('crypto')

/**
 *
 */
const sha256 = function() {
  const data = Array.from(arguments)
  const hasher = crypto.createHash('sha256')

  data.forEach((item) => hasher.update(item.toString()))
  return hasher.digest()
}

/**
 *
 * @param {string} password
 * @param {number} keyLen
 * @param {number} loops
 */
const createBasicSalt = function(password, keyLen, loops = 8) {
  let salt = sha256(password, keyLen, password.length * loops)

  for (let i = 0; i < loops; i++) salt = Buffer.concat([salt, sha256(salt, i, password)])

  return salt
}

/**
 *
 * @param {string|Buffer|URL} filepath
 */
const createPasswordFromFile = function(filepath) {
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash('sha256')
    const fstream = fs.createReadStream(filepath)

    fstream.on('data', (d) => hasher.update(d))
    fstream.on('end', () => resolve(shasum.digest('hex')))
  })
}

/**
 *
 * @param {string} password
 * @param {number} keyLen
 * @param {string|Buffer|TypedArray|DataView} salt
 */
const createKey = function(password, keyLen, salt = null) {
  salt = salt === null ? createBasicSalt(password, keyLen) : salt
  return crypto.scryptSync(password, salt, keyLen)
}

/**
 *
 * @param {string|Buffer|URL} filepath
 * @param {number} keyLen
 * @param {string|Buffer|TypedArray|DataView} salt
 */
const createKeyFromFile = function(filepath, keyLen, salt = null) {
  const password = 'abcdefg'
  return createKey(password, keyLen, salt)
}

module.exports = { createKey, createPasswordFromFile }
