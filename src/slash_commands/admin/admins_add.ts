import { Client, CommandInteraction } from 'discord.js'

import fb from '../../firebase'
import {getGuild, updateGuild} from '../../firebase/controllers'
import { ensureAdmin, getGuildIdFromInteraction } from '../../utils'

export const adminsAddHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
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
            content: `You don't have permissions to add an admin to this server`
        })
    }

    const userToAdd = interaction.options.getUser('user')

    const updates = {
        admins: fb.firestore.FieldValue.arrayUnion(userToAdd?.id)
    }
    const [updated, updatedError] = await updateGuild(guildId, updates)
    if (!updated || updatedError) {
        return await interaction.reply({
            content: `An error occurred adding ${userToAdd?.username} as an admin`,
        })
    }

    await interaction.reply({
        content: `${userToAdd?.username} is now an admin`,
    })
}
