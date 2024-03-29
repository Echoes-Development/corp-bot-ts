import { Client, CommandInteraction, EmbedFieldData, MessageEmbed, TextChannel } from 'discord.js'

import { EE_MINERALS } from '../../eve_echoes/minerals'

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

export const indyBuyMineralsHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
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
    [EE_MINERALS.isogen]: { amount: interaction.options.getNumber(EE_MINERALS.isogen) || 0, iskPer: guild.resourcePrices.minerals.isogen.buy || 0 },
    [EE_MINERALS.megacyte]: { amount: interaction.options.getNumber(EE_MINERALS.megacyte) || 0, iskPer: guild.resourcePrices.minerals.megacyte.buy || 0 },
    [EE_MINERALS.mexallon]: { amount: interaction.options.getNumber(EE_MINERALS.mexallon) || 0, iskPer: guild.resourcePrices.minerals.mexallon.buy || 0 },
    [EE_MINERALS.morphite]: { amount: interaction.options.getNumber(EE_MINERALS.morphite) || 0, iskPer: guild.resourcePrices.minerals.morphite.buy || 0 },
    [EE_MINERALS.nocxium]: { amount: interaction.options.getNumber(EE_MINERALS.nocxium) || 0, iskPer: guild.resourcePrices.minerals.nocxium.buy || 0 },
    [EE_MINERALS.pyerite]: { amount: interaction.options.getNumber(EE_MINERALS.pyerite) || 0, iskPer: guild.resourcePrices.minerals.pyerite.buy || 0 },
    [EE_MINERALS.tritanium]: { amount: interaction.options.getNumber(EE_MINERALS.tritanium) || 0, iskPer: guild.resourcePrices.minerals.tritanium.buy || 0 },
    [EE_MINERALS.zydrine]: { amount: interaction.options.getNumber(EE_MINERALS.zydrine) || 0, iskPer: guild.resourcePrices.minerals.zydrine.buy || 0 },
  }

  // Loop through order input operation to make embeddable properties for the new thread
  const embedOpts: EmbedFieldData[] = []
  let totalIsk = 0
  Object.keys(opts).forEach((key) => {
    const formatNum = new Intl.NumberFormat('en-US')
    const val = opts[key]
    if (val.amount && val.amount > 0) {
      const subTotal = Math.ceil(val.amount * val.iskPer)
      totalIsk += subTotal
      embedOpts.push({ 
        name: `${key.toUpperCase().replace(/_/g, ' ')} - ${formatNum.format(Math.ceil(val.iskPer))} ISK PER`, 
        value: `${formatNum.format(Math.ceil(val.amount))}\n${formatNum.format(subTotal)} ISK` 
      })
    }
  })
  if (embedOpts.length === 0) {
    return await  interaction.reply({
      content: 'No minerals to process order, aborting',
      ephemeral: true,
    })
  }
  embedOpts.push({ 
    name: 'Total ISK To Donate', 
    value: new Intl.NumberFormat('en-US').format(totalIsk) 
  })

  // Find the channel that we need to create a thread from
  let channel: TextChannel
  try {
    channel = await (client.channels.cache.get(guild.industry.buyChannel) as TextChannel)
    if (!channel) {
      return await interaction.reply({
        content: 'Could not find buy channel for indy, have you set it?',
        ephemeral: true,
      })
    }
  } catch (e) {
    console.error(e)
    return await interaction.reply({
      content: 'Unable to create a new thread in the industry buy channel',
      ephemeral: true,
    })
  }

  // Create a new thread on the channel from guild settings
  const [thread, threadError] = await createThread(
    channel,
    `[Buy Mins] - ${interaction.user.username}`,
    `${interaction.user.username} is wanting to buy minerals from the corp`,
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
    purchasing: embedOpts.map((embedRow) => ({ name: embedRow.name, value: parseInt(embedRow.value) })),
    selling: [],
    status: OrderStatus.PENDING,
    type: OrderType.MINERALS,
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
          .setTitle('New Buy Mineral Order')
          .addFields(embedOpts)
      ]
    })
  } catch (e) {
    console.error(e)
    return await interaction.reply({
      content: 'Unable to create buy mineral thread',
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
