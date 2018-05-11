'use strict'

const scryfall = require('../lib/scryfall')
const DEFAULT_MAX_RESULTS = 5

module.exports = function query (searchTerm) {
  let maxNumberOfResults = process.env.HUBOT_MTG_MAX_QUERY_RESULTS || DEFAULT_MAX_RESULTS
  let scryfallSearchUrl = `https://scryfall.com/search?q=${encodeURIComponent(searchTerm)}`
  return scryfall.search(searchTerm).then((cards) => {
    let exceedsMax = cards.total_cards > maxNumberOfResults
    if (exceedsMax) {
      cards.splice(maxNumberOfResults, cards.length - maxNumberOfResults)
    }

    let message = cards.map(card => card.name).join('\n')

    if (exceedsMax) {
      let remainingCards = cards.total_cards - maxNumberOfResults
      message += `\n${remainingCards} more card${remainingCards > 1 ? 's' : ''} found. See all: ${scryfallSearchUrl}\n`
    }

    return {
      cards,
      scryfallSearchUrl,
      message
    }
  })
}
