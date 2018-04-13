'use strict'

const rulings = require('../../commands/rulings')
const scryfall = require('../../lib/scryfall')

describe('rulings', function () {
  beforeEach(function () {
    this.rulings = [{
      comment: 'rule 1'
    }, {
      comment: 'rule 2'
    }]
    this.card = {
      object: 'card',
      name: 'Foo',
      getRulings: this.sandbox.stub().resolves(this.rulings)
    }
    this.sandbox.stub(scryfall, 'queryByName').resolves(this.card)
  })

  it('resolves with a card, rulings and a message', function () {
    return rulings('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.rulings).to.equal(this.rulings)
      expect(result.message).to.equal('• rule 1\n• rule 2')
    })
  })

  it('resolves with no rulings message if no ruligns are found', function () {
    this.card.getRulings.resolves([])
    return rulings('Budoka Gardener').then((result) => {
      expect(result.card).to.equal(this.card)
      expect(result.rulings).to.deep.equal([])
      expect(result.message).to.equal('No rulings found for Foo')
    })
  })
})
