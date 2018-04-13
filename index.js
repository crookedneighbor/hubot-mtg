'use strict'

// Description:
//   Displays Magic: The Gathering cards and/or information about them
//
// Dependencies:
//   scryfall-client
//
// Configuration:
//   None
//
// Commands:
//   hubot (magic|mtg) <name> - Display a Magic: The Gathering card named <name>

const commands = require('./commands')

function makeMTGRegex (keyword) {
  return new RegExp(`(?:magic|mtg)\\s+${keyword}\\s*$`, 'i')
}

module.exports = (robot) => {
  robot.respond(makeMTGRegex('(.*)'), (msg) => {
    let commandPromise
    let name = msg.match[1]
    let firstWord = name.split(' ')[0]

    if (firstWord in commands) {
      name = name.substring(firstWord.length + 1)
      commandPromise = commands[firstWord](name)
    } else {
      commandPromise = commands.show(name)
    }

    commandPromise.then((res) => {
      msg.send(res.message)
    }).catch((err) => {
      console.error(err)
      msg.send(`Could not find \`${name}\``)
    })
  })
}
