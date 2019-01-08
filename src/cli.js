#!/usr/bin/env node

const cli = require('commander')
const encrypt = require('./encrypt')
const decrypt = require('./decrypt')
const createKey = require('./create-key')
const pkg = require('../package.json')

cli
    .version(pkg.version)
    .description(pkg.description)

cli
    .command('encrypt <file> <password>')
    .alias('e')
    .action((file, password, options) => {
        const key = createKey(password, 24)
        encrypt(file, key)
    })

cli
    .command('decrypt <file> <password>')
    .alias('d')
    .action((file, password, options) => {
        const key = createKey(password, 24)
        decrypt(file, key)
    })

cli.parse(process.argv)
