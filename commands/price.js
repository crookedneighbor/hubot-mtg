'use strict'

let scryfall = require('../lib/scryfall')

module.exports = function price (name) {
  return scryfall.queryByName(name).then((card) => {
    let message
    const { usd, tix } = card

    if (usd && tix) {
      message = `$${card.usd} or ${card.tix} tickets`
    } else if (usd) {
      message = `$${card.usd}`
    } else if (tix) {
      message = `${card.tix} tickets`
    } else {
      message = `Can't find price data for ${card.name}`
    }

    return {
      card,
      message
    }
  })
}
