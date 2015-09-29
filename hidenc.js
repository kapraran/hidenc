#!/usr/bin/env node

var program = require('commander');
var encrypt = require('./encrypt');
var decrypt = require('./decrypt');

program
    .version('0.2.0')
    .arguments('<file> <key>')
    .option('-e, --encrypt', 'Encrypt a file')
    .option('-d, --decrypt', 'Decrypt a file')
    .action(function(file, key) {
        if (this.encrypt)
            return encrypt.call(this, file, key);

        if (this.decrypt)
            return decrypt.call(this, file, key);
    })
    .parse(process.argv);