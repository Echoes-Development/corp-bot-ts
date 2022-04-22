import { Client, CommandInteraction } from 'discord.js'

import { SLASH_COMMAND_DEFINITIONS } from '../definitions'
import { getGuild } from "../../firebase/controllers";
import { ensureAdmin } from "../../utils";

export const adminCommandsSetHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const guildId = interaction.guild?.id
  if (!guildId) {
    return await interaction.reply({
      content: 'Invalid Guild ID',
    })
  }

  // Get guild settings
  const [guild, guildError] = await getGuild(guildId)
  if (!guild || guildError) {
    return await interaction.reply({
      content: 'An error occurred fetching your guild settings',
    })
  }

  const isAdmin = ensureAdmin(guild, interaction.user.id)
  if (!isAdmin) {
    return await interaction.reply({
      content: `You don't have permissions to update the slash commands for this server`
    })
  }

  try {
    await client.guilds.cache.get(guildId)?.commands.set(SLASH_COMMAND_DEFINITIONS)
  } catch (e) {
    console.error('Unable to set guild slash commands', e)
    return await interaction.reply({
      content: 'An error occurred updating your slash commands',
    })
  }

  try {
    await interaction.reply({
      content: `Slash commands have been set/updated`,
    })
  } catch (e) {
    console.error(e)
  }
}
