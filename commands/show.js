'use strict'

let scryfall = require('../lib/scryfall')

module.exports = function show (name) {
  let card

  return scryfall.queryByName(name).then((cardResult) => {
    card = cardResult

    return card.getImage()
  }).then((url) => {
    return {
      card,
      imageUrl: url,
      message: url
    }
  })
}
