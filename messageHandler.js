const axios = require('axios')
const Server = require('./Server')

const vibeCheck = require('./vibeCheck')

const registerServer = async channel => {
  try {
    if (await Server.findOne({ serverId: channel.guild.id }))
      return 'Your server is already registered'

    const server = new Server({
      serverId: channel.guild.id,
      channelId: channel.id,
      users: []
    })

    await server.save()
    return 'Server Registered!'
  } catch (e) {
    return 'Error'
  }
}

const registerUser = async user => {
  try {
    const serverFound = await Server.findOne({ serverId: user.serverId })
    if (!serverFound)
      return 'Your server it not registered yet, use /start'

    if (serverFound.users.find(e => e.at === user.at))
      return 'You are already registered'

    serverFound.users = [
      ...serverFound.users,
      user
    ]

    await serverFound.save()

    return 'Registrado'

  } catch (e) {
    return e
  }
}

module.exports = async (msg) => {
  if (msg.content.startsWith('/join')) {
    const codeStatsUser = msg.content.replace('/join ', '')

    try {
      await axios.get(`https://codestats.net/api/users/${codeStatsUser}`)
    } catch (e) {
      return msg.channel.send('Você não existe, Duente')
    }

    const resp = await registerUser({
      at: msg.author.toString(),
      codeStatsUser: codeStatsUser,
      serverId: msg.channel.guild.id,
    })

    return msg.channel.send(resp)
  }

  if (msg.content === '/start') {
    const resp = await registerServer(msg.channel)
    return msg.channel.send(resp)
  }

  if (msg.content === '/drop') {
    await Server.deleteMany({})
    return msg.channel.send('ok')
  }

  if (msg.content === '/list') {
    return msg.channel.send(JSON.stringify(await Server.find({})))
  }

  if (msg.content === '/vibecheck') {
    return msg.channel.send(await vibeCheck(msg.channel.guild.id))
  }
}