'use strict'

const mtgSpoilers = require('mtg-spoilers')
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

function getMostRecentSet () {
  return scryfall.get('sets').then((sets) => {
    return sets[0]
  })
}

function pollForSpoilers (setCode, onNewSpoilers) {
  return mtgSpoilers(setCode, {
    onNewSpoilers
  })
}

module.exports = {
  getMostRecentSet,
  pollForSpoilers,
  queryByName,
  search
}
