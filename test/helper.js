var sinon = require('sinon')
var chai = require('chai')

global.expect = chai.expect
chai.use(require('sinon-chai'))

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()

  this.rejectIfResolves = function () {
    throw new Error('Should not resolve')
  }
})

afterEach(function () {
  this.sandbox.restore()
})
