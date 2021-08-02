import fetch from 'node-fetch'
import { getGuildCommands } from './get_guild_commands'

export const deleteGuildCommands = async (guildId: string) => {
  const { BOT_APP_ID, BOT_TOKEN } = process.env

  try {
    const commands = await getGuildCommands(guildId)

    await Promise.all(commands.map(async (cmd) => {
      console.log(`Deleting command: ${cmd.id} - ${cmd.name}`)
      await fetch(
        `https://discord.com/api/applications/${BOT_APP_ID}/guilds/${guildId}/commands/${cmd.id}`,
        {
          method: 'delete',
          headers: {
            Authorization: `Bot ${BOT_TOKEN}`
          }
        })
    }))

    console.log("Delete complete")
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
