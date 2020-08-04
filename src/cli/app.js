#!/usr/bin/env node

const app = require('commander')
const pkg = require('../../package.json')

const EncryptAction = require('./actions/encryptAction')
const DecryptAction = require('./actions/decryptAction')
const RemoveAction = require('./actions/removeAction')

app
  .name(pkg.name)
  .version(pkg.version)
  .description(pkg.description)
  .option('-o, --output-file <file>', 'Output file path')
  .option('-f, --password-file', 'Use a file instead of a string as the password')
  .option('-s, --salt <str>', 'Use a custom string as salt for the key creation')

app
  .command('encrypt <file> <password>')
  .alias('e')
  .description('Encrypt the file using the specified password')
  .option('-x, --ext <ext>', 'Set the extension of the encrypted file', '.enc')
  .action((file, password, options) => new EncryptAction().run(file, password, options))

app
  .command('decrypt <file> <password>')
  .alias('d')
  .description('Decrypt the file using the specified password')
  .option('-x, --ext <ext>', 'Set the extension of the decrypted file', '.dec')
  .action((file, password, options) => new DecryptAction().run(file, password, options))

app
  .command('remove <file>')
  .alias('r')
  .description('Delete a file with an extra layer of safety')
  .option('-p, --passes <passes>', 'The number of sanitization passes', 4)
  .action((file, options) => new RemoveAction().run(file, options))

app.parse(process.argv)
