const ora = require('ora')

class Action {
  constructor() {
    this.spinner = ora('Initializing...').start()
    this.spinner.interval = 250
  }

  run() {
    const runArgs = arguments

    Promise.resolve()
      .then(() => this.validateInput.apply(this, runArgs))
      .then(this.action.bind(this))
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
  }

  validateInput() {
    return Promise.resolve()
  }

  action(args) {
    return Promise.resolve()
  }

  onSuccess() {
    this.spinner.succeed('Ok')
  }

  onError(err) {
    this.spinner.fail('Failed')
  }
}

module.exports = Action
