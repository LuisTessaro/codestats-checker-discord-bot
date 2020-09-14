const Server = require('./Server')
const axios = require('axios')
module.exports = async serverId => {
  try {
    const list = await Server.findOne({ serverId: serverId })
    const fetchList = list.users.map(async user => {
      return {
        codeStatsResp: await axios.get(`https://codestats.net/api/users/${user.codeStatsUser}`),
        at: user.at
      }
    })

    const fetchResp = await Promise.all(fetchList)

    const parsed = fetchResp.map(e => ({ xp: e.codeStatsResp.data.new_xp, name: e.at }))

    const ordered = parsed.sort((a, b) => {
      return b.xp - a.xp
    })

    const tanso = ordered[ordered.length - 1]
    const gigaChad = ordered[0]

    let ranking = '\n'

    ordered.forEach((user, i) => {
      ranking += `${i + 1}º - ${user.name} : ${user.xp}xp\n`
    })

    return `O MAIOR RETARDADO DO DISC É O ${tanso.name} essa bixa fez ${tanso.xp}xp hj, como pode\nJÁ O MAIOR GIGA CHAD É O ${gigaChad.name} pq esse DEUS DO BULLET fez ${gigaChad.xp} \n ${ranking}`
  } catch (e) {
    console.log(e)
    return 'bbb'
  }
}
