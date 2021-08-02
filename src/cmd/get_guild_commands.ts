import { ApplicationCommand } from 'discord.js'

import fetch from 'node-fetch'

export const getGuildCommands = async (guildId: string): Promise<ApplicationCommand[]> => {
  const { BOT_APP_ID, BOT_TOKEN } = process.env

  try {
    const results = await fetch(
      `https://discord.com/api/applications/${BOT_APP_ID}/guilds/${guildId}/commands`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        }
      }).then((resp) => resp.json())
    console.log('--GUILD COMMANDS--')
    console.log(results)
    console.log('--/GUILD COMMANDS--')
    return results
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
