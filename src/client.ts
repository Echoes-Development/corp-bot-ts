import { Client, Intents } from 'discord.js'

export const getClient = () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS,
    ]
  })

  client.on('ready', () => {
    console.info(`Logged in as ${client.user ? client.user.tag : 'unknown'}!`)
  })

  return client
}
