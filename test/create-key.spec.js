const { createKey } = require('../src/create-key')
const assert = require('assert')

const someRandomPassword = 'PHxkhHv25QDyP2EC'

describe('Create key length test', function() {
  it('should create a key of length 0', function() {
    const key = createKey(someRandomPassword, 0)
    assert.equal(key.length, 0)
  })

  it('should create a key of length 4', function() {
    const key = createKey(someRandomPassword, 4)
    assert.equal(key.length, 4)
  })

  it('should create a key of length 12', function() {
    const key = createKey(someRandomPassword, 12)
    assert.equal(key.length, 12)
  })

  it('should create a key of length 2000', function() {
    const key = createKey(someRandomPassword, 2000)
    assert.equal(key.length, 2000)
  })
})
