const crypto = require('crypto')

/**
 * Creates a sha256 hash of its arguments
 */
function sha256() {
  const data = Array.from(arguments)
  const hasher = crypto.createHash('sha256')

  data.forEach((item) => hasher.update(item.toString()))
  return hasher.digest()
}

/**
 * Generates a basic salt to be used when no salt
 * was explicitly given
 * 
 * @param {array} entropy
 */
function createBasicSalt(entropy) {
  const hasher = crypto.createHash('sha256')
  const loops = entropy.length * 8

  for (let i = 0; i < loops; i++) hasher.update(sha256(i, entropy[i % entropy.length]))

  return hasher.digest()
}

/**
 * Creates a password based on the contents of a
 * given file
 *
 * @param {string|Buffer|URL} filepath
 */
function createPasswordFromFile(filepath) {
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash('sha256')
    const fstream = fs.createReadStream(filepath)

    fstream.on('data', (d) => hasher.update(d))
    fstream.on('end', () => resolve(hasher.digest('hex')))
    fstream.on('error', reject)
  })
}

/**
 * Creates and returns a scrypt key based on a given
 * password and salt
 *
 * @param {string} password
 * @param {number} keyLen
 * @param {string|Buffer|TypedArray|DataView} salt
 */
function createKey(password, keyLen, salt = null) {
  salt = salt === null ? createBasicSalt([password, keyLen]) : salt
  return crypto.scryptSync(password, salt, keyLen)
}

/**
 * Creates and returns a scrypt key based on the
 * contents of a given file
 *
 * @param {string|Buffer|URL} filepath
 * @param {number} keyLen
 * @param {string|Buffer|TypedArray|DataView} salt
 */
async function createKeyFromFile(filepath, keyLen, salt = null) {
  const password = await createPasswordFromFile(filepath)
  return createKey(password, keyLen, salt)
}

module.exports = { createKey, createKeyFromFile }
