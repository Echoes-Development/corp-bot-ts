import { Client, CommandInteraction } from 'discord.js'

import { getGuildIdFromInteraction } from '../utils'
import { updateGuild } from '../../firebase/controllers/guild'

export const adminIndustryChannelsHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const [guildId, guildIdErr] = await getGuildIdFromInteraction(interaction)
  if (!guildId || guildIdErr) {
    return await interaction.reply({
      content: 'Invalid Guild ID',
      ephemeral: true,
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
      ephemeral: true,
    })
  }

  await interaction.reply({
    content: `Industry channels have been updated`,
    ephemeral: true,
  })
}
