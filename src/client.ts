import { Client, Intents } from 'discord.js'

import { guildCreate } from './events'
import { getFullHandlerName, SLASH_COMMAND_HANDLERS } from './slash_commands'

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

  client.on('guildCreate', (guild) => {
    console.log(`New guild added: ${guild.name}`)
    guildCreate(client, guild)
  })

  client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;

    const cmdName = getFullHandlerName(interaction, interaction.commandName)
    if (typeof SLASH_COMMAND_HANDLERS[cmdName] !== 'function') {
      return interaction.reply({
        content: 'Unable to process that command',
        ephemeral: true
      })
    }
    SLASH_COMMAND_HANDLERS[cmdName](client, interaction)
  })

  return client
}
