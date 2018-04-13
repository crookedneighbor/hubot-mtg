'use strict'

let scryfall = require('../lib/scryfall')

module.exports = function price (name) {
  return scryfall.queryByName(name).then((card) => {
    let message
    const { usd, tix, name } = card

    if (usd && tix) {
      message = `${name} - $${card.usd} or ${card.tix} tickets`
    } else if (usd) {
      message = `${name} - $${card.usd}`
    } else if (tix) {
      message = `${name} - ${card.tix} tickets`
    } else {
      message = `Can't find price data for ${name}`
    }

    return {
      card,
      message
    }
  })
}
