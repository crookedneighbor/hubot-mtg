'use strict'

const stringSimilarity = require('string-similarity')
const findClosestCard = require('../../lib/find-closest-card')

describe('findClosestCard', function () {
  beforeEach(function () {
    this.cards = [{
      name: 'Foo'
    }, {
      name: 'Foo\'s fury'
    }, {
      name: 'Foo, Bar'
    }]
  })

  it('returns first card if only one card is passed in', function () {
    this.sandbox.spy(stringSimilarity, 'findBestMatch')

    let card = findClosestCard('Bar', [{name: 'Foo'}])

    expect(card.name).to.equal('Foo')
    expect(stringSimilarity.findBestMatch.callCount).to.equal(0)
  })

  it('returns closest card', function () {
    expect(findClosestCard('Fo', this.cards)).to.equal(this.cards[0])
    expect(findClosestCard('Fu', this.cards)).to.equal(this.cards[1])
    expect(findClosestCard('Fo Ba', this.cards)).to.equal(this.cards[2])
  })
})
