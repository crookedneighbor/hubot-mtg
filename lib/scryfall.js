'use strict'

const ScryfallClient = require('scryfall-client')
const scryfall = new ScryfallClient()

const findClosestCard = require('./find-closest-card')

function search (query, options = {}) {
  Object.assign(options, {
    q: query.replace(/’/, "'")
  })

  return scryfall.get('cards/search', options)
}

function queryByName (name) {
  return search(name).then((cards) => {
    return findClosestCard(name, cards)
  })
}

module.exports = {
  queryByName,
  search
}
