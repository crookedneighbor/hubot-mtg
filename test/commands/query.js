'use strict'

const query = require('../../commands/query')
const scryfall = require('../../lib/scryfall')

describe('query', function () {
  beforeEach(function () {
    this.card = {
      object: 'card',
      name: 'Foo',
      getImage: this.sandbox.stub().resolves('https://img.scryfall.com/cards/normal/en/set/100a.jpg')
    }
    this.secondCard = {
      object: 'card',
      name: 'Bar',
      getImage: this.sandbox.stub().resolves('https://img.scryfall.com/cards/normal/en/set/200a.jpg')
    }
    this.cards = [
      this.card,
      this.secondCard
    ]
    this.cards.total_cards = 2
    this.sandbox.stub(scryfall, 'search').resolves(this.cards)
  })

  it('resolves with cards, a scryfall url and a message', function () {
    return query('o:vigilance').then((result) => {
      expect(result.cards).to.deep.equal([this.card, this.secondCard])
      expect(result.scryfallSearchUrl).to.equal('https://scryfall.com/search?q=o%3Avigilance')
      expect(result.message).to.equal('Foo\nBar')
    })
  })

  it('has a max result of 5 cards', function () {
    let cards = []

    for (let i = 0; i < 25; i++) {
      cards.push({name: `Name ${i}`})
    }
    cards.total_cards = 25
    expect(cards.length).to.equal(25)

    scryfall.search.resolves(cards)

    return query('o:vigilance').then((result) => {
      expect(result.cards[0].name).to.equal('Name 0')
      expect(result.cards.length).to.equal(5)
      expect(result.message).to.equal('Name 0\nName 1\nName 2\nName 3\nName 4\n20 more cards found. See all: https://scryfall.com/search?q=o%3Avigilance\n')
    })
  })

  it('can override max result', function () {
    let cards = []

    for (let i = 0; i < 25; i++) {
      cards.push({name: `Name ${i}`})
    }
    cards.total_cards = 25
    expect(cards.length).to.equal(25)

    scryfall.search.resolves(cards)

    process.env.HUBOT_MTG_MAX_QUERY_RESULTS = 10

    return query('o:vigilance').then((result) => {
      expect(result.cards[0].name).to.equal('Name 0')
      expect(result.cards.length).to.equal(10)
      expect(result.message).to.equal('Name 0\nName 1\nName 2\nName 3\nName 4\nName 5\nName 6\nName 7\nName 8\nName 9\n15 more cards found. See all: https://scryfall.com/search?q=o%3Avigilance\n')

      delete process.env.HUBOT_MTG_MAX_QUERY_RESULTS
    })
  })

  it('does not pluralize when only 1 extra card remains', function () {
    let cards = []

    for (let i = 0; i < 6; i++) {
      cards.push({name: `Name ${i}`})
    }
    cards.total_cards = 6
    expect(cards.length).to.equal(6)

    scryfall.search.resolves(cards)

    return query('o:vigilance').then((result) => {
      expect(result.message).to.equal('Name 0\nName 1\nName 2\nName 3\nName 4\n1 more card found. See all: https://scryfall.com/search?q=o%3Avigilance\n')
    })
  })
})
