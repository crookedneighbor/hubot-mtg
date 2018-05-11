'use strict'

// Description:
//   Displays Magic: The Gathering cards and/or information about them
//
// Dependencies:
//   scryfall-client
//   mtg-spoilers
//   string-similarity: "^1.2.0"
//
// Configuration:
//   HUBOT_MTG_MAX_QUERY_RESULTS - How many results to display from `mtg query` command. Defaults to 5.
//   HUBOT_MTG_SPOILERS_TIMEOUT - How long in milliseconds to wait after the last spoiler is found until automatically stoppoing the spoiler feed. Defaults to 24 hours.
//   HUBOT_MTG_SPOILERS_ITERATION - How long to wait in milliseconds in between polling for new spoilers. Defaults to 15 minutes.

const commands = require('./commands')

const COMMANDS_WITH_SPECIAL_BEHAVIOR = {
  spoilers: true
}

function makeMTGRegex (keyword) {
  return new RegExp(`(?:magic|mtg)\\s+${keyword}\\s*$`, 'i')
}

module.exports = (robot) => {
  if (robot.commands) {
    robot.commands.push('hubot (magic|mtg) <name> - Display a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) (transform|flip) <name> - Display the reverse side of a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) (price|$) <name> - Display the prices for a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) query <search term> - Display the cards matching the <search term>. A max of 5 cards will be returned. If more than 5 are found, a link to scryfall will be provided')
    robot.commands.push('hubot (magic|mtg) rulings <name> - Display the rulings for a Magic: The Gathering card named <name>')
    robot.commands.push('hubot (magic|mtg) spoilers [<set_code>] - Display the spoilers for a Magic: The Gathering set with code <set_code>; defaults to the latest set')
    robot.commands.push('hubot (magic|mtg) spoilers cancel - Cancel all  running spoilers for Magic: the Gathing sets')
  }

  robot.respond(makeMTGRegex('(.*)'), (msg) => {
    let commandPromise
    let name = msg.match[1]
    let firstWord = name.split(' ')[0]

    if (firstWord in COMMANDS_WITH_SPECIAL_BEHAVIOR) {
      return
    } else if (firstWord in commands) {
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

  robot.respond(makeMTGRegex('spoilers(.*)'), (msg) => {
    let set = msg.match[1].trim()

    if (set === 'cancel') {
      return commands.spoilers.cancel()
    }

    commands.spoilers(msg, set).catch((err) => {
      console.error(err)
      msg.send('Something went wrong when looking up spoilers.')
    })
  })
}
