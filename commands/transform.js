'use strict'

let scryfall = require('../lib/scryfall')

module.exports = function transform (name) {
  let card

  return scryfall.queryByName(name).then((cardResult) => {
    card = cardResult

    return card.getBackImage()
  }).then((urls) => {
    return {
      card,
      imageUrls: urls,
      message: `${card.name} - ${urls.join(' ')}`
    }
  })
}
