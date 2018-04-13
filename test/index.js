'use strict'

const Helper = require('hubot-test-helper')
const helper = new Helper('../index.js')

const commands = require('../commands')

function wait (time = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

describe('hubot-mtg', function () {
  this.slow(500)

  beforeEach(function () {
    this.room = helper.createRoom()

    Object.keys(commands).forEach((command) => {
      this.sandbox.stub(commands, command).resolves({
        card: {},
        message: `${command} message`
      })
    })
  })

  afterEach(function () {
    this.room.destroy()
  })

  it('responds to magic', async function () {
    await this.room.user.say('tamiyo', 'hubot magic Moon Sage')

    expect(commands.show).to.be.calledWith('Moon Sage')

    await wait()

    expect(this.room.messages).to.deep.equal([
      ['tamiyo', 'hubot magic Moon Sage'],
      ['hubot', 'show message']
    ])
  })

  it('responds to mtg', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg Moon Sage')

    expect(commands.show).to.be.calledWith('Moon Sage')

    await wait()

    expect(this.room.messages).to.deep.equal([
      ['tamiyo', 'hubot mtg Moon Sage'],
      ['hubot', 'show message']
    ])
  })

  it('listens for transform command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg transform Jace, Vryn')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.transform).to.be.calledWith('Jace, Vryn')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'transform message'])
  })

  it('listens for query command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg query o:vigilance')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.query).to.be.calledWith('o:vigilance')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'query message'])
  })

  it('listens for flip command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg flip Jace, Vryn')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.flip).to.be.calledWith('Jace, Vryn')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'flip message'])
  })

  it('listens for price command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg price Jadelight')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.price).to.be.calledWith('Jadelight')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'price message'])
  })

  it('listens for $ command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg $ Jadelight')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.$).to.be.calledWith('Jadelight')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', '$ message'])
  })

  it('listens for rulings command', async function () {
    await this.room.user.say('tamiyo', 'hubot mtg rulings Living Death')

    expect(commands.show.callCount).to.equal(0)
    expect(commands.rulings).to.be.calledWith('Living Death')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'rulings message'])
  })

  it('reports error when command rejects', async function () {
    let error = new Error('Ah!')

    this.sandbox.stub(console, 'error')
    commands.show.rejects(error)

    await this.room.user.say('tamiyo', 'hubot mtg Roon')

    await wait()

    expect(this.room.messages[1]).to.deep.equal(['hubot', 'Could not find `Roon`'])
    expect(console.error).to.be.calledWith(error)
  })
})
