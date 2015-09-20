#!/usr/bin/env node

var encryptor = require('file-encryptor');
var args = process.argv.slice(2);

if (args.length < 1)
    return console.log('[ERROR] Required args missing');

var mode = args[0];

if (mode === '--encfile') {
    require('./encfile-controller')();
} else if (mode === '--encrypt' || mode === '--decrypt')  {
    require('./inline-controller')(args);
} else {
    return console.log('[ERROR] Invalid mode');
}