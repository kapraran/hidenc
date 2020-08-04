const encrypt = require('./encrypt')
const decrypt = require('./decrypt')
const removeFile = require('./remove')
const { createKey, createKeyFromFile } = require('./create-key')

module.exports = { encrypt, decrypt, removeFile, createKey, createKeyFromFile }
