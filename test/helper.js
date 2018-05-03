var sinon = require('sinon')
var chai = require('chai')

global.expect = chai.expect
chai.use(require('sinon-chai'))

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()

  this.rejectIfResolves = function () {
    throw new Error('Should not resolve')
  }

  this.wait = function (time = 5) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time)
    })
  }
})

afterEach(function () {
  this.sandbox.restore()
})
