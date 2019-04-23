const path = require('path')
const fs = require('fs')
const util = require('util')

const fsMkdir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.exists)
const fsAccess = util.promisify(fs.access)

/**
 *
 * @param {string} filepath
 */
const validateFile = function(filepath) {
    return fsAccess(filepath, fs.F_OK).then(() => filepath)
}

/**
 *
 * @param {number|string} n
 */
const validatePasses = function(n) {
    n = parseInt(n)

    // check if invalid
    if (isNaN(n) || n < 1)
        throw Error(`Invalid 'passes' value. A positive integer is required.`)

    return n
}

/**
 *
 * @param {string} dirpath
 */
const mkdirp = function(dirpath) {
    const segments = path.posix.resolve(dirpath).split('/')
    let promise = Promise.resolve()

    for (let end=2; end<=segments.length; end++) {
        const tmpDirpath = segments.slice(0, end).join('/')

        // chain promises
        promise = promise
            .then(() => fsExists(tmpDirpath))
            .then((exists) => exists ? 1: fsMkdir(tmpDirpath))
    }

    return promise
}

/**
 *
 * @param {string} ext
 */
const validateExtension = function(ext) {
    ext = ext.trim()
    ext = ext[0] != '.' ? `.${ext}`: ext

    return ext.length > 1 ? ext: '.enc'
}

module.exports = {
    validateFile,
    validatePasses,
    validateExtension,
    mkdirp
}
