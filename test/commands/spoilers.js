'use strict'

const spoilers = require('../../commands/spoilers')
const scryfall = require('../../lib/scryfall')

describe('spoilers', function () {
  beforeEach(function () {
    this.fakeMsg = {
      message: {
        room: 'room'
      },
      send: this.sandbox.stub()
    }
    this.fakeCard = {
      id: 'fake-card-1',
      name: 'Fake Card',
      getImage: this.sandbox.stub().resolves('https://card.image.png')
    }
    this.fakeSet = {
      code: 'FAKE',
      name: 'Fake Set'
    }
    this.fakeHandler = {
      set: this.fakeSet,
      latestSpoiler: this.fakeCard,
      cancel: this.sandbox.stub()
    }
    this.sandbox.stub(scryfall, 'pollForSpoilers').resolves(this.fakeHandler)
    this.sandbox.stub(scryfall, 'getMostRecentSet').resolves({code: 'MOST_RECENT_SET'})
  })

  afterEach(function () {
    spoilers.cancel(this.fakeMsg)
  })

  it('defaults to most recent set code if no code is provided', function () {
    return spoilers(this.fakeMsg).then(() => {
      expect(scryfall.getMostRecentSet.callCount).to.equal(1)
      expect(scryfall.pollForSpoilers).to.be.calledWith('MOST_RECENT_SET')
    })
  })

  it('does not query for most recent set if code is passed', function () {
    return spoilers(this.fakeMsg, 'CODE').then(() => {
      expect(scryfall.getMostRecentSet.callCount).to.equal(0)
      expect(scryfall.pollForSpoilers).to.be.calledWith('CODE')
    })
  })

  it('can pass custom timeout to spoilers command', function () {
    process.env.HUBOT_MTG_SPOILERS_TIMEOUT = 500

    return spoilers(this.fakeMsg, 'CODE').then(() => {
      expect(scryfall.pollForSpoilers).to.be.calledWith('CODE', this.sandbox.match({
        timeout: 500
      }))
      delete process.env.HUBOT_MTG_SPOILERS_TIMEOUT
    })
  })

  it('can pass custom iteration to spoilers command', function () {
    process.env.HUBOT_MTG_SPOILERS_ITERATION = 500

    return spoilers(this.fakeMsg, 'CODE').then(() => {
      expect(scryfall.pollForSpoilers).to.be.calledWith('CODE', this.sandbox.match({
        iteration: 500
      }))
      delete process.env.HUBOT_MTG_SPOILERS_ITERATION
    })
  })

  it('sends a message about listening for cards for specified set and presents latest spoiler', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      expect(this.fakeMsg.send).to.be.calledWith('Watching for new spoilers for Fake Set...')
      expect(this.fakeMsg.send).to.be.calledWith('Fake Card - https://card.image.png')
    })
  })

  it('sends messages about new cards when they are available', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(async () => {
      await this.wait()

      let onNewSpoilersFunction = scryfall.pollForSpoilers.args[0][1].onNewSpoilers

      this.fakeMsg.send.resetHistory()

      onNewSpoilersFunction([{
        id: 'fake-card-2',
        name: 'Card 2',
        getImage: this.sandbox.stub().resolves('https://card2.png')
      }, {
        id: 'fake-card-3',
        name: 'Card 3',
        getImage: this.sandbox.stub().resolves('https://card3.png')
      }, {
        id: 'fake-card-4',
        name: 'Card 4',
        getImage: this.sandbox.stub().resolves('https://card4.png')
      }])

      await this.wait()

      expect(this.fakeMsg.send.callCount).to.equal(3)
      expect(this.fakeMsg.send).to.be.calledWith('Card 2 - https://card2.png')
      expect(this.fakeMsg.send).to.be.calledWith('Card 3 - https://card3.png')
      expect(this.fakeMsg.send).to.be.calledWith('Card 4 - https://card4.png')
    })
  })

  it('sends message about timeout when called', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(async () => {
      await this.wait()

      let timeoutFunction = scryfall.pollForSpoilers.args[0][1].onTimeout

      this.fakeMsg.send.resetHistory()

      timeoutFunction()

      await this.wait()

      expect(this.fakeMsg.send.callCount).to.equal(1)
      expect(this.fakeMsg.send).to.be.calledWith('No new spoilers for Fake Set were found in 24 hours. Stopping spoiler feed...')
    })
  })

  it('skips opening message if spoilers have already started', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      this.fakeMsg.send.resetHistory()

      return spoilers(this.fakeMsg, 'FAKE')
    }).then(() => {
      expect(this.fakeMsg.send).to.not.be.calledWith('Watching for new spoilers for Fake Set...')
    })
  })

  it('presents opening message if spoilers have already started, but was resent in a different room', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      this.fakeMsg.send.resetHistory()

      this.fakeMsg.message.room = 'another-room'

      return spoilers(this.fakeMsg, 'FAKE')
    }).then(() => {
      expect(this.fakeMsg.send).to.be.calledWith('Watching for new spoilers for Fake Set...')
    })
  })

  it('sends message about no new cards if spoilers is called while no new cards are available', function () {
    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      this.fakeMsg.send.resetHistory()

      return spoilers(this.fakeMsg, 'FAKE')
    }).then(() => {
      expect(this.fakeMsg.send.callCount).to.equal(1)
      expect(this.fakeMsg.send).to.be.calledWith('No new cards spoiled since Fake Card.')
    })
  })

  it('spoils new card if spoilers command is called and new spoilers were found', function () {
    let secondFakeHandler = {
      set: this.fakeSet,
      latestSpoiler: {
        id: 'fake-card-2',
        name: 'Fake Card 2',
        getImage: this.sandbox.stub().resolves('https://card2.image.png')
      },
      cancel: this.sandbox.stub()
    }

    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      this.fakeMsg.send.resetHistory()

      scryfall.pollForSpoilers.resolves(secondFakeHandler)
      return spoilers(this.fakeMsg, 'FAKE')
    }).then(() => {
      expect(this.fakeMsg.send.callCount).to.equal(1)
      expect(this.fakeMsg.send).to.be.calledWith('Fake Card 2 - https://card2.image.png')
    })
  })

  it('cancels the old handler if spoilers command is called twice', function () {
    let secondFakeHandler = {
      set: this.fakeSet,
      latestSpoiler: {
        id: 'fake-card-2',
        name: 'Fake Card 2',
        getImage: this.sandbox.stub().resolves('https://card2.image.png')
      },
      cancel: this.sandbox.stub()
    }

    return spoilers(this.fakeMsg, 'FAKE').then(() => {
      this.fakeMsg.send.resetHistory()

      scryfall.pollForSpoilers.resolves(secondFakeHandler)
      return spoilers(this.fakeMsg, 'FAKE')
    }).then(() => {
      expect(this.fakeHandler.cancel.callCount).to.equal(1)
    })
  })

  describe('cancel', function () {
    it('cancels and sends a message about cancelling the feed for each set', function () {
      let secondFakeHandler = {
        set: {
          code: 'FAKE2',
          name: 'Fake Set 2'
        },
        latestSpoiler: {
          id: 'fake-card-2',
          name: 'Fake Card 2',
          getImage: this.sandbox.stub().resolves('https://card2.image.png')
        },
        cancel: this.sandbox.stub()
      }

      return spoilers(this.fakeMsg, 'FAKE').then(() => {
        scryfall.pollForSpoilers.resolves(secondFakeHandler)

        return spoilers(this.fakeMsg, 'FAKE2')
      }).then(async () => {
        await this.wait()

        this.fakeMsg.send.resetHistory()

        spoilers.cancel(this.fakeMsg)

        expect(this.fakeHandler.cancel.callCount).to.equal(1)
        expect(secondFakeHandler.cancel.callCount).to.equal(1)
        expect(this.fakeMsg.send.callCount).to.equal(2)
        expect(this.fakeMsg.send).to.be.calledWith('Cancelling spoiler feed for Fake Set.')
        expect(this.fakeMsg.send).to.be.calledWith('Cancelling spoiler feed for Fake Set 2.')
      })
    })
  })
})
