'use strict'

let scryfall = require('../../lib/scryfall')
let ScryfallClient = require('scryfall-client')

describe('scryfall', function () {
  beforeEach(function () {
    this.sandbox.stub(ScryfallClient.prototype, 'get').resolves()
  })

  describe('search', function () {
    beforeEach(function () {
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
})
