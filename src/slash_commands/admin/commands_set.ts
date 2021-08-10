import { Client, CommandInteraction } from 'discord.js'

import { SLASH_COMMAND_DEFINITIONS } from '../definitions'

export const adminCommandsSetHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const guildId = interaction.guild?.id
  if (!guildId) {
    return await interaction.reply({
      content: 'Invalid Guild ID',
      ephemeral: true,
    })
  }

  try {
    await client.guilds.cache.get(guildId)?.commands.set(SLASH_COMMAND_DEFINITIONS)
  } catch (e) {
    console.error('Unable to set guild slash commands', e)
    return await interaction.reply({
      content: 'An error occurred updating your slash commands',
      ephemeral: true,
    })
  }

  try {
    await interaction.reply({
      content: `Slash commands have been set/updated`,
      ephemeral: true,
    })
  } catch (e) {
    console.error(e)
  }
}
