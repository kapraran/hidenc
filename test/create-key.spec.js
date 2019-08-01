const { createKey } = require('../src/create-key')
const { expect } = require('chai')

const randomPasswords = {
  weak: 'Mt2JDY',
  strong: 'XU73f^mZ6ksJ.-hB',
  unbelievable:
    'WmfABtMeDY86Sf8VW7tjzgH78RBBs6qck83h2SgbNw7SDy9J4aKTPUXAs8CxLLkbHFfYbSvgHSQpjeNNHneLfZ9WVueTYtLMkx7dLBWpndwdE7zNT8Rmj8WRkV4ntfNXLJh9mjLJkYuSzPhvekgvYgtTnrWxxyStnDCVmYHJdRFr7hef3PWSUtzbadS7y3SVGPkheUCp6nfUdjwyaYSsueMUfRHsfVXxqUjeS2X8X6Ktw3A8xFKc6FKpgD3TU6CG',
}

const keyLens = [0, 2, 4, 8, 16, 256, 1024]

describe('Test key length of createKey function for `weak` password', () => {
  keyLens.forEach((keyLen) => {
    it(`should create a key of length ${keyLen}`, () => {
      expect(createKey(randomPasswords.weak, keyLen).length).to.equal(keyLen)
    })
  })
})

describe('Test key length of createKey function for `strong` password', () => {
  keyLens.forEach((keyLen) => {
    it(`should create a key of length ${keyLen}`, () => {
      expect(createKey(randomPasswords.weak, keyLen).length).to.equal(keyLen)
    })
  })
})

describe('Test key length of createKey function for `unbelievable` password', () => {
  keyLens.forEach((keyLen) => {
    it(`should create a key of length ${keyLen}`, () => {
      expect(createKey(randomPasswords.weak, keyLen).length).to.equal(keyLen)
    })
  })
})
