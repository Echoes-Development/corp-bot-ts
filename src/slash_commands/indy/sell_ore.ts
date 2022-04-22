import { Client, CommandInteraction, EmbedFieldData, MessageEmbed, TextChannel } from 'discord.js'

import { EE_ORE } from '../../eve_echoes'

import fb from '../../firebase'
import { createOrder, getGuild } from '../../firebase/controllers'
import { OrderStatus, OrderType } from '../../types/order'
import { 
  addMembersToThread, 
  addRoleToThread, 
  createThread,
  getGuildIdFromInteraction,
  respondToSlashCommandString
} from '../../utils'

export const indySellOreHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  // Verify guild is available
  const [guildId, guildIdErr] = await getGuildIdFromInteraction(interaction)
  if (!guildId || guildIdErr) {
    return await respondToSlashCommandString(interaction, 'Invalid Guild ID')
  }

  // Get guild settings
  const [guild, guildError] = await getGuild(guildId)
  if (!guild || guildError) {
    return await respondToSlashCommandString(interaction, 'An error occurred fetching your guild settings')
  }

  // Create opts object that has order input information from command options
  const opts: { [min: string]: { amount: number, iskPer: number } } = {
    [EE_ORE.arkonor]: { amount: interaction.options.getNumber(EE_ORE.arkonor) || 0, iskPer: guild.resourcePrices.ore.arkonor.sell || 0 },
    [EE_ORE.bistot]: { amount: interaction.options.getNumber(EE_ORE.bistot) || 0, iskPer: guild.resourcePrices.ore.bistot.sell || 0 },
    [EE_ORE.crokite]: { amount: interaction.options.getNumber(EE_ORE.crokite) || 0, iskPer: guild.resourcePrices.ore.crokite.sell || 0 },
    [EE_ORE.dark_ochre]: { amount: interaction.options.getNumber(EE_ORE.dark_ochre) || 0, iskPer: guild.resourcePrices.ore.dark_ochre.sell || 0 },
    [EE_ORE.gneiss]: { amount: interaction.options.getNumber(EE_ORE.gneiss) || 0, iskPer: guild.resourcePrices.ore.gneiss.sell || 0 },
    [EE_ORE.jaspet]: { amount: interaction.options.getNumber(EE_ORE.jaspet) || 0, iskPer: guild.resourcePrices.ore.jaspet.sell || 0 },
    [EE_ORE.kernite]: { amount: interaction.options.getNumber(EE_ORE.kernite) || 0, iskPer: guild.resourcePrices.ore.kernite.sell || 0 },
    [EE_ORE.hedbergite]: { amount: interaction.options.getNumber(EE_ORE.hedbergite) || 0, iskPer: guild.resourcePrices.ore.hedbergite.sell || 0 },
    [EE_ORE.hemorphite]: { amount: interaction.options.getNumber(EE_ORE.hemorphite) || 0, iskPer: guild.resourcePrices.ore.hemorphite.sell || 0 },
    [EE_ORE.omber]: { amount: interaction.options.getNumber(EE_ORE.omber) || 0, iskPer: guild.resourcePrices.ore.omber.sell || 0 },
    [EE_ORE.plagioclase]: { amount: interaction.options.getNumber(EE_ORE.plagioclase) || 0, iskPer: guild.resourcePrices.ore.plagioclase.sell || 0 },
    [EE_ORE.pyroxeres]: { amount: interaction.options.getNumber(EE_ORE.pyroxeres) || 0, iskPer: guild.resourcePrices.ore.pyroxeres.sell || 0 },
    [EE_ORE.scordite]: { amount: interaction.options.getNumber(EE_ORE.scordite) || 0, iskPer: guild.resourcePrices.ore.scordite.sell || 0 },
    [EE_ORE.spodumain]: { amount: interaction.options.getNumber(EE_ORE.spodumain) || 0, iskPer: guild.resourcePrices.ore.spodumain.sell || 0 },
    [EE_ORE.veldspar]: { amount: interaction.options.getNumber(EE_ORE.veldspar) || 0, iskPer: guild.resourcePrices.ore.veldspar.sell || 0 },  
  }

  // Loop through order input operation to make embeddable properties for the new thread
  const embedOpts: EmbedFieldData[] = []
  let totalIsk = 0
  Object.keys(opts).forEach((key) => {
    const val = opts[key]
    if (val.amount && val.amount > 0) {
      const subTotal = val.amount * val.iskPer
      totalIsk += subTotal
      embedOpts.push({ 
        name: `${key.toUpperCase().replace(/_/g, ' ')} - ${val.iskPer} ISK PER`, 
        value: `${val.amount.toString()}\n${subTotal} ISK` 
      })
    }
  })
  if (embedOpts.length === 0) {
    return await  interaction.reply({
      content: 'No ore to process order, aborting',
      ephemeral: true,
    })
  }
  embedOpts.push({ name: 'Total ISK To Donate', value: totalIsk.toString() })

  // Find the channel that we need to create a thread from
  let channel: TextChannel
  try {
    channel = await (client.channels.cache.get(guild.industry.sellChannel) as TextChannel)
    if (!channel) {
      return await interaction.reply({
        content: 'Could not find sell channel for indy, have you set it?',
        ephemeral: true,
      })
    }
  } catch (e) {
    console.error(e)
    return await interaction.reply({
      content: 'Unable to create a new thread in the industry sell channel',
      ephemeral: true,
    })
  }

  // Create a new thread on the channel from guild settings
  const [thread, threadError] = await createThread(
    channel,
    `[Sell Ore] - ${interaction.user.username}`,
    `${interaction.user.username} is wanting to sell ore from the corp`,
    10080
  )
  if (!thread || threadError) {
    return await interaction.reply({
      content: 'Unable to create a new thread for order',
      ephemeral: true,
    })
  }

  // Create a new order on firebase
  const [order, orderError] = await createOrder(guildId, {
    amountIsk: totalIsk,
    createdAt: fb.firestore.FieldValue.serverTimestamp(),
    createdBy: {
      id: interaction.user.id,
      nickname: interaction.user.username
    },
    discord: {
      channelId: channel.id,
      threadId: thread.id,
    },
    guildId,
    purchasing: [],
    selling: embedOpts.map((embedRow) => ({ name: embedRow.name, value: parseInt(embedRow.value) })),
    status: OrderStatus.PENDING,
    type: OrderType.ORE,
    updatedAt: fb.firestore.FieldValue.serverTimestamp(),
  })
  if (!order || orderError) {
    // TODO: Delete thread if this part fails
    return await interaction.reply({
      content: 'Unable to create a new order in database',
      ephemeral: true,
    })
  }

  // Add the member who created the order to the thread
  const [addedMembers, addedMembersError] = await addMembersToThread(thread, [interaction.user.id])
  if (!addedMembers || addedMembersError) {
    return await interaction.reply({
      content: 'Unable to add members to the new thread',
      ephemeral: true,
    })
  }

  if (guild.industry.roleFulfillment) {
    const [addedRole, addedRoleErr] = await addRoleToThread(thread, guild.industry.roleFulfillment)
    if (!addedRole || addedRoleErr) {
      return await interaction.reply({
        content: 'Unable to add fulfillment industry role',
        ephemeral: true,
      })
    }
  }

  // Create a new embed and send it to the new spawned thread
  try {
    await thread.send({
      embeds: [
        new MessageEmbed()
          .setColor('#FFDD00')
          .setTitle('New Sell Ore Order')
          .addFields(embedOpts)
      ]
    })
  } catch (e) {
    console.error(e)
    return await interaction.reply({
      content: 'Unable to create sell Ore thread',
      ephemeral: true,
    })
  }

  // Complete the order by informing the user
  try {
    await interaction.reply({
      content: `Order received, a new thread has been created for you`,
      ephemeral: true,
    })
  } catch (e) {
    console.error(e)
  }
}
