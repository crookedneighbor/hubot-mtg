'use strict'

const price = require('../../commands/price')
const scryfall = require('../../lib/scryfall')

describe('price', function () {
  beforeEach(function () {
    this.card = {
      object: 'card',
      name: 'Foo',
      usd: '10.00',
      tix: '1'
    }
    this.sandbox.stub(scryfall, 'queryByName').resolves(this.card)
  })

  it('resolves with a card and a message', function () {
    return price('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.message).to.equal('$10.00 or 1 tickets')
    })
  })

  it('message contains just usd if no tix property is avialable', function () {
    delete this.card.tix

    return price('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.message).to.equal('$10.00')
    })
  })

  it('message contains just tix if no usd property is avialable', function () {
    delete this.card.usd

    return price('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.message).to.equal('1 tickets')
    })
  })

  it('message contains information about not having a price', function () {
    delete this.card.usd
    delete this.card.tix

    return price('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.message).to.equal('Can\'t find price data for Foo')
    })
  })
})
