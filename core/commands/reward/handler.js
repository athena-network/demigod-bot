const MessageController = require('../message-controller')

const daemon = require('turtlecoin-rpc').TurtleCoind

const rpc = new daemon({
  host: process.env.DAEMON_HOST,
  port: process.env.DAEMON_PORT,
  timeout: process.env.DAEMON_TIMEOUT
})

class RewardCommand extends MessageController {
  constructor () {
    super()
    this.global = true
    this.cooldown = 20000
  }

  handler (message) {
    if (this.lastUsed + this.cooldown > Date.now()) return
    this.lastUsed = Date.now()

    rpc.getLastBlockHeader()
    .then((response) => {
      var count = (response.reward / 100).toLocaleString()

      message.channel.send('The current block reward is **' + count + '** ATHX.')
    }).catch((err) => {
      console.log(err)
    })
  }
}

module.exports = new RewardCommand()