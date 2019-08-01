#!/usr/bin/env node

var program = require("commander")
var encrypt = require("./encrypt")
var decrypt = require("./decrypt")
var pkg = require("../package.json")

program
  .version(pkg.version)
  .arguments("<file> <key>")
  .option("-e, --encrypt", "Encrypt a file")
  .option("-d, --decrypt", "Decrypt a file")
  .action(function(file, key) {
    if (this.encrypt) return encrypt.call(this, file, key)
    if (this.decrypt) return decrypt.call(this, file, key)

    console.error("ERROR: Missing arguments")
  })
  .parse(process.argv)
