import { Client, CommandInteraction, EmbedFieldData, MessageEmbed, TextChannel } from 'discord.js'

import fb from '../../firebase'
import { CMGuild } from '../../types/guild'
import { EE_MINERALS } from '../../eve_echoes/minerals'

export const indyBuyMineralsHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  // TODO: this check should be it's own function as it will be used a lot
  const guildId = interaction.guild?.id
  if (!guildId) {
    return await interaction.reply({
      content: 'Invalid Guild ID',
      ephemeral: true,
    })
  }

  // TODO: this should be it's own function in it's own file as it will be used a lot
  let guild: CMGuild
  try {
    guild = await fb.firestore()
      .collection('guilds')
      .doc(guildId)
      .get()
      .then((resp): CMGuild => resp.data() as CMGuild)
  } catch (e) {
    console.error('Unable to set guild slash commands', e)
    return await interaction.reply({
      content: 'An error occurred updating your slash commands',
      ephemeral: true,
    })
  }
  if (!guild) {
    return await interaction.reply({
      content: 'Unable to load guild data',
      ephemeral: true,
    })
  }

  const embedOpts: EmbedFieldData[] = []
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
  Object.keys(opts).forEach((key) => {
    const val = opts[key]
    if (val && val > 0) {
      embedOpts.push({ name: key, value: val.toString() })
    }
  })

  // TODO: Create thread helpers to re-use the below code for other things that will spawn threads
  try {
    const channel = interaction.channel as TextChannel
    const thread = await channel.threads.create({
      autoArchiveDuration: 10080,
      name: `buy-min-${interaction.user.username.toLowerCase()}`,
      reason: `${interaction.user.username} is wanting to buy minerals from the corp`,
    })
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
