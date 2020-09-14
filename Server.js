const mongoose = require('mongoose')

module.exports = mongoose.model('Server', {
  serverId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
  }
})