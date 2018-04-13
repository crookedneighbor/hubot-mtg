'use strict'

const stringSimilarity = require('string-similarity')

module.exports = function findClosesCard (name, cards) {
  if (cards.length === 1) {
    return cards[0]
  }

  let cardNames = cards.map(card => card.name.toLowerCase())
  let bestMatch = stringSimilarity.findBestMatch(name.toLowerCase(), cardNames).bestMatch.target
  let index = cardNames.indexOf(bestMatch)

  return cards[index]
}
