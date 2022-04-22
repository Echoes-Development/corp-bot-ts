import { Client, CommandInteraction } from 'discord.js'

import { getGuild, updateGuild } from '../../firebase/controllers'
import { ensureAdmin, getGuildIdFromInteraction } from "../../utils";
import { IndyTypes } from "../../types";

export const adminIndustryRolesHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
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
            content: `You don't have permissions to modify industry roles`
        })
    }

    const roleToAdd = interaction.options.getRole('role')
    const type = interaction.options.getString('type')

    let updates = {}
    switch (type) {
        case IndyTypes.BP_MANU:
            updates = { 'industry.roleBP': roleToAdd?.id }
            break
        case IndyTypes.ORDER_FULFILLMENT:
            updates = { 'industry.roleFulfillment': roleToAdd?.id }
            break
        case IndyTypes.RIG_MANU:
            updates = { 'industry.roleRig': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_BATTLESHIP:
            updates = { 'industry.roleShipBattleship': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_BCRUISER:
            updates = { 'industry.roleShipBcruiser': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_CAPITAL:
            updates = { 'industry.roleShipCapital': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_CRUISER:
            updates = { 'industry.roleShipCruiser': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_DESTROYER:
            updates = { 'industry.roleShipDestroyer': roleToAdd?.id }
            break
        case IndyTypes.SHIP_MANU_FRIGATE:
            updates = { 'industry.roleShipFrigate': roleToAdd?.id }
            break
        case IndyTypes.STRUCTURE_MANU:
            updates = { 'industry.roleStructure': roleToAdd?.id }
            break
    }
    const [updated, updatedError] = await updateGuild(guildId, updates)
    if (!updated || updatedError) {
        return await interaction.reply({
            content: `An error occurred setting this industry role`,
        })
    }

    await interaction.reply({
        content: `Role is set`,
    })
}
