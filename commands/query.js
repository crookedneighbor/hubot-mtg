'use strict'

const scryfall = require('../lib/scryfall')
const MAX_RESULTS = 5

module.exports = function query (searchTerm) {
  let scryfallSearchUrl = `https://scryfall.com/search?q=${encodeURIComponent(searchTerm)}`
  return scryfall.search(searchTerm).then((cards) => {
    var exceedsMax = cards.total_cards > MAX_RESULTS
    if (exceedsMax) {
      cards.splice(MAX_RESULTS, cards.length - MAX_RESULTS)
    }

    let message = cards.map(card => card.name).join('\n')

    if (exceedsMax) {
      let remainingCards = cards.total_cards - MAX_RESULTS
      message += `\n${remainingCards} more card${remainingCards > 1 ? 's' : ''} found. See all: ${scryfallSearchUrl}\n`
    }

    return {
      cards,
      scryfallSearchUrl,
      message
    }
  })
}
