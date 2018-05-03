'use strict'

const scryfall = require('../lib/scryfall')

const spoilerCache = {}

function sendNewCards (msg, cards) {
  cards.forEach((card) => {
    card.getImage().then((image) => {
      msg.send(`${card.name} - ${image}`)
    })
  })
}

function spoilers (msg, setCode) {
  return Promise.resolve().then(() => {
    if (setCode) {
      return setCode
    }

    return scryfall.getMostRecentSet().then(set => set.code)
  }).then((code) => {
    return scryfall.pollForSpoilers(code, (spoilers) => {
      sendNewCards(msg, spoilers)
    })
  }).then((handler) => {
    let identifier = msg.message.room + handler.set.code

    if (!spoilerCache[identifier]) {
      msg.send(`Watching for new spoilers for ${handler.set.name}...`)
      sendNewCards(msg, [handler.latestSpoiler])
    } else {
      let oldLatestSpoiler = spoilerCache[identifier].latestSpoiler

      if (oldLatestSpoiler.id === handler.latestSpoiler.id) {
        msg.send(`No new cards spoiled since ${handler.latestSpoiler.name}.`)
      } else {
        sendNewCards(msg, [handler.latestSpoiler])
      }

      spoilerCache[identifier].cancel()
    }

    spoilerCache[identifier] = handler
  })
}

spoilers.cancel = function (msg) {
  Object.keys(spoilerCache).forEach((identifier) => {
    let handler = spoilerCache[identifier]

    msg.send(`Cancelling spoiler feed for ${handler.set.name}.`)

    handler.cancel()
    delete spoilerCache[identifier]
  })
}

module.exports = spoilers
