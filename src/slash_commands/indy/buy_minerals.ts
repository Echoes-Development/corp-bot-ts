import { Client, CommandInteraction, EmbedFieldData, MessageEmbed, TextChannel } from 'discord.js'

import { EE_MINERALS } from '../../eve_echoes/minerals'
import { getGuildIdFromInteraction } from '../utils'
import { getGuild } from '../../firebase/controllers/guild'

export const indyBuyMineralsHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const [guildId, guildIdErr] = await getGuildIdFromInteraction(interaction)
  if (!guildId || guildIdErr) {
    return await interaction.reply({
      content: 'Invalid Guild ID',
      ephemeral: true,
    })
  }

  const [guild, guildError] = await getGuild(guildId)
  if (!guild || guildError) {
    return await interaction.reply({
      content: 'An error occurred fetching your guild settings',
      ephemeral: true,
    })
  }

  const opts: { [min: string]: number } = {
    [EE_MINERALS.isogen]: interaction.options.getNumber(EE_MINERALS.isogen) || 0,
    [EE_MINERALS.megacyte]: interaction.options.getNumber(EE_MINERALS.megacyte) || 0,
    [EE_MINERALS.mexallon]: interaction.options.getNumber(EE_MINERALS.mexallon) || 0,
    [EE_MINERALS.morphite]: interaction.options.getNumber(EE_MINERALS.morphite) || 0,
    [EE_MINERALS.nocxium]: interaction.options.getNumber(EE_MINERALS.nocxium) || 0,
    [EE_MINERALS.pyerite]: interaction.options.getNumber(EE_MINERALS.pyerite) || 0,
    [EE_MINERALS.tritanium]: interaction.options.getNumber(EE_MINERALS.tritanium) || 0,
    [EE_MINERALS.zydrine]: interaction.options.getNumber(EE_MINERALS.zydrine) || 0,
  }

  const embedOpts: EmbedFieldData[] = []
  Object.keys(opts).forEach((key) => {
    const val = opts[key]
    if (val && val > 0) {
      embedOpts.push({ name: key, value: val.toString() })
    }
  })
  if (embedOpts.length === 0) {
    return await  interaction.reply({
      content: 'No minerals to process, aborting'
    })
  }

  // TODO: Create thread helpers to re-use the below code for other things that will spawn threads
  try {
    let channel = await (client.channels.cache.get(guild.industry.buyChannel) as TextChannel)
    if (!channel) {
      return await interaction.reply({
        content: 'Could not find buy channel for indy, have you set it?'
      })
    }

    const thread = await channel.threads.create({
      autoArchiveDuration: 10080,
      name: `Buy Min ${interaction.user.username}`,
      reason: `${interaction.user.username} is wanting to buy minerals from the corp`,
    })

    await thread.members.add(interaction.user.id)
    await thread.send({
      embeds: [
        new MessageEmbed()
          .setColor('#FFDD00')
          .setTitle('New Buy Mineral Order')
          .addFields(
            embedOpts
          )
      ]
    })
  } catch (e) {
    console.error(e)
    return await interaction.reply({
      content: 'Unable to create buy mineral thread',
      ephemeral: true,
    })
  }

  try {
    await interaction.reply({
      content: `Order received, a new thread has been created for you`,
      ephemeral: true,
    })
  } catch (e) {
    console.error(e)
  }
}
