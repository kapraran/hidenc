#!/usr/bin/env node

const app = require('commander')
const encrypt = require('../encrypt')
const decrypt = require('../decrypt')
const createKey = require('../create-key')
const iutils = require('./input-utils')
const pkg = require('../../package.json')

app
    .name(pkg.name)
    .version(pkg.version)
    .description(pkg.description)
    .option('-o, --output-file <file>', 'Output file path')

app
    .command('encrypt <file> <password>')
    .alias('e')
    .description('Encrypt the file using the specified password')
    .option('-x, --ext <ext>', 'Set the extension of the encrypted file', '.enc')
    .action((file, password, options) => {
        const key = createKey(password, 24)
        const ext = iutils.validateExtension(options.ext)

        encrypt(file, key, {
            extension: ext
        })
    })

app
    .command('decrypt <file> <password>')
    .alias('d')
    .description('Decrypt the file using the specified password')
    .option('-x, --ext <ext>', 'Set the extension of the decrypted file', '.dec')
    .action((file, password, options) => {
        const key = createKey(password, 24)
        const ext = iutils.validateExtension(options.ext)

        decrypt(file, key, {
            extension: ext
        })
    })

app.parse(process.argv)
