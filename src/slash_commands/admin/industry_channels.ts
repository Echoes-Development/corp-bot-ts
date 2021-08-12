import { Client, CommandInteraction } from 'discord.js'

import { getGuildIdFromInteraction } from '../utils'
import {getGuild, updateGuild} from '../../firebase/controllers/guild'
import {ensureAdmin} from "../../utils/permissions";

export const adminIndustryChannelsHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const [guildId, guildIdErr] = await getGuildIdFromInteraction(interaction)
  if (!guildId || guildIdErr) {
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
      content: `You don't have permissions to modify the industry channels for this server`
    })
  }

  const updates = {
    'industry.buyChannel': interaction.options.getChannel('buy_channel')?.id,
    'industry.sellChannel': interaction.options.getChannel('sell_channel')?.id,
  }
  const [updated, updatedError] = await updateGuild(guildId, updates)
  if (!updated || updatedError) {
    return await interaction.reply({
      content: 'An error occurred updating your guild industry channel settings',
    })
  }

  await interaction.reply({
    content: `Industry channels have been updated`,
  })
}
