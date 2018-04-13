'use strict'

const show = require('../../commands/show')
const scryfall = require('../../lib/scryfall')

describe('show', function () {
  beforeEach(function () {
    this.card = {
      object: 'card',
      name: 'Foo',
      getImage: this.sandbox.stub().resolves('https://img.scryfall.com/cards/normal/en/set/100a.jpg')
    }
    this.sandbox.stub(scryfall, 'queryByName').resolves(this.card)
  })

  it('resolves with a card and a message', function () {
    return show('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.imageUrl).to.equal('https://img.scryfall.com/cards/normal/en/set/100a.jpg')
      expect(result.message).to.equal('Foo - https://img.scryfall.com/cards/normal/en/set/100a.jpg')
    })
  })
})
