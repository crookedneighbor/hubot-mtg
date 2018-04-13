'use strict'

let scryfall = require('../lib/scryfall')

module.exports = function rulings (name) {
  let card

  return scryfall.queryByName(name).then((cardResult) => {
    card = cardResult

    return card.getRulings()
  }).then((rulings) => {
    let message

    if (rulings.length === 0) {
      message = `No rulings found for ${card.name}`
    } else {
      message = `Rulings for ${card.name}:\n`
      message += rulings.map(rule => `• ${rule.comment}`).join('\n')
    }

    return {
      card,
      rulings,
      message
    }
  })
}
