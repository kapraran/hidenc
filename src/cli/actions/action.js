class Action {
  run() {
    const runArgs = arguments

    Promise
      .resolve()
      .then(() => this.validateInput.apply(this, runArgs))
      .then(this.action)
      .then(this.onSuccess)
      .catch(this.onError)
  }

  validateInput() {
    return Promise.resolve()
  }

  action(args) {
    return Promise.resolve()
  }

  onSuccess() {
    console.log('OK')
  }

  onError(err) {
    console.error(err)
  }
}

module.exports = Action
