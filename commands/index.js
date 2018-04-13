'use strict'

let commands = {
  show: require('./show'),
  transform: require('./transform'),
  price: require('./price'),
  query: require('./query'),
  rulings: require('./rulings')
}

// aliases
commands.flip = commands.transform
commands.$ = commands.price

module.exports = commands
