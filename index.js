require('dotenv/config')
const mongoose = require('mongoose')
const Discord = require('discord.js')
const client = new Discord.Client()
const cron = require('node-cron')

const vibeCheck = require('./vibeCheck')

const Server = require('./Server')

const messageHandler = require('./messageHandler')

client.on('ready', async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }, (err) => {
    if (err) {
      console.log('[ERROR] Mongoose ERROR')
      throw err
    }
    console.log('[INFO] Mongoose Started')
  })


  cron.schedule('0 */12 * * *', async () => {
    const servers = await Server.find()

    servers.forEach(async server => {
      client.channels.cache.get(server.channelId).send(await vibeCheck(server.serverId))
    })
  })

  client.user.setPresence({
    activity: {
      name: 'Prz Burro'
    }
  })

  console.log(`[INFO] Bot started!`)
})

client.on('message', async msg => {
  if (msg.author.bot)
    return
    
  await messageHandler(msg)
})

client.login(process.env.TOKEN)
