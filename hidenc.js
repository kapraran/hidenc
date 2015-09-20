#!/usr/bin/env node

var encryptor = require('file-encryptor');
var _ = require('underscore');
var args = process.argv.slice(2);

if (args.length < 1)
    return console.log('[ERROR] Required args missing');

var mode = args[0];
var valid_modes = ['--encrypt', '--e', '--decrypt', '--d'];

if (mode === '--encfile') {
    require('./encfile-controller')();
} else if (_.contains(valid_modes, mode))  {
    require('./inline-controller')(args);
} else {
    return console.log('[ERROR] Invalid mode');
}