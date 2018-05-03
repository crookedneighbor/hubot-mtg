'use strict'

let scryfall = require('../../lib/scryfall')
let ScryfallClient = require('scryfall-client')

describe('scryfall', function () {
  describe('search', function () {
    beforeEach(function () {
      this.sandbox.stub(ScryfallClient.prototype, 'get')
      ScryfallClient.prototype.get.withArgs('cards/search').resolves([{
        object: 'card',
        name: 'Foo'
      }, {
        object: 'card',
        name: 'Foo Bar'
      }])
    })

    it('replaces smart quotes in query', function () {
      return scryfall.search('Foo’s card').then((card) => {
        expect(ScryfallClient.prototype.get).to.be.calledWith('cards/search', {
          q: 'Foo\'s card'
        })
      })
    })

    it('calls scryfall search api with query', function () {
      return scryfall.search('o:historic').then((card) => {
        expect(ScryfallClient.prototype.get).to.be.calledWith('cards/search', {
          q: 'o:historic'
        })
      })
    })

    it('can pass in additional params', function () {
      return scryfall.search('o:historic', {
        include_extras: true,
        dir: 'asc'
      }).then((card) => {
        expect(ScryfallClient.prototype.get).to.be.calledWith('cards/search', {
          q: 'o:historic',
          include_extras: true,
          dir: 'asc'
        })
      })
    })
  })

  describe('queryByName', function () {
    beforeEach(function () {
      this.sandbox.stub(ScryfallClient.prototype, 'get')
      ScryfallClient.prototype.get.withArgs('cards/search').resolves([{
        object: 'card',
        name: 'Foo'
      }, {
        object: 'card',
        name: 'Foo Bar'
      }])
    })

    it('rejects with error if request errors', function () {
      let error = new Error('404')

      ScryfallClient.prototype.get.withArgs('cards/search').rejects(error)

      return scryfall.queryByName('Foo').then(this.rejectIfResolves).catch((err) => {
        expect(ScryfallClient.prototype.get.callCount).to.equal(1)
        expect(err).to.equal(error)
      })
    })

    it('resolves with card closest in name to provided name', function () {
      return scryfall.queryByName('Fo').then((card) => {
        expect(card.name).to.equal('Foo')

        return scryfall.queryByName('F b')
      })
    })
  })

  describe('getMostRecentSet', function () {
    beforeEach(function () {
      this.sandbox.stub(ScryfallClient.prototype, 'get')
      ScryfallClient.prototype.get.withArgs('sets').resolves([{
        object: 'set',
        name: 'Set 1'
      }, {
        object: 'set',
        name: 'Set 2'
      }])
    })

    it('resolves with the first set', function () {
      return scryfall.getMostRecentSet().then((set) => {
        expect(set.name).to.equal('Set 1')
      })
    })
  })

  describe('pollForSpoilers', function () {
    it('starts polling for spoilers and gives a spoiler handler', function () {
      this.timeout(10000)

      let onNewSpoilers = this.sandbox.stub()

      return scryfall.pollForSpoilers('DOM', {onNewSpoilers}).then((handler) => {
        handler.cancel()
      })
    })
  })
})
