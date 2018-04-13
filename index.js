'use strict'

// Description:
//   Displays Magic: The Gathering cards and/or information about them
//
// Dependencies:
//   scryfall-client
//   string-similarity: "^1.2.0"
//
// Configuration:
//   None

const commands = require('./commands')

function makeMTGRegex (keyword) {
  return new RegExp(`(?:magic|mtg)\\s+${keyword}\\s*$`, 'i')
}

module.exports = (robot) => {
  if (robot.commands) {
    robot.commands.push('hubot (magic|mtg) <name> - Display a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) (transform|flip) <name> - Display the reverse side of a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) (price|$) <name> - Display the prices for a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) rulings <name> - Display the rulings for a Magic: The Gathering card named <name>')
  }

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
