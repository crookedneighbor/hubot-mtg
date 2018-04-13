'use strict'

const transform = require('../../commands/transform')
const scryfall = require('../../lib/scryfall')

describe('transform', function () {
  beforeEach(function () {
    this.card = {
      object: 'card',
      name: 'Foo',
      getBackImage: this.sandbox.stub().resolves(['https://img.scryfall.com/cards/normal/en/set/100a.jpg'])
    }
    this.sandbox.stub(scryfall, 'queryByName').resolves(this.card)
  })

  it('resolves with the image for the back side of a card', function () {
    return transform('Jace, vryn').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.imageUrls[0]).to.equal('https://img.scryfall.com/cards/normal/en/set/100a.jpg')
      expect(result.message).to.equal('Foo - https://img.scryfall.com/cards/normal/en/set/100a.jpg')
    })
  })

  it('resolves with both images for the front side of a meld card', function () {
    this.card.getBackImage.resolves(['https://img.scryfall.com/cards/normal/en/emn/15a.jpg', 'https://img.scryfall.com/cards/normal/en/emn/28a.jpg'])
    return transform('Brisela').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.message).to.equal('Foo - https://img.scryfall.com/cards/normal/en/emn/15a.jpg https://img.scryfall.com/cards/normal/en/emn/28a.jpg')
    })
  })
})
