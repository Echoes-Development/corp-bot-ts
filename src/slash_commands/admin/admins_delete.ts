import { Client, CommandInteraction } from 'discord.js'

import fb from '../../firebase'
import {getGuild, updateGuild} from '../../firebase/controllers'
import { ensureAdmin, getGuildIdFromInteraction } from "../../utils";

export const adminsDeleteHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
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
            content: `You don't have permissions to remove an admin from this server`
        })
    }

    const userToDelete = interaction.options.getUser('user')

    const updates = {
        admins: fb.firestore.FieldValue.arrayRemove(userToDelete?.id)
    }
    const [updated, updatedError] = await updateGuild(guildId, updates)
    if (!updated || updatedError) {
        return await interaction.reply({
            content: `An error occurred removing ${userToDelete?.username} as an admin`,
        })
    }

    await interaction.reply({
        content: `${userToDelete?.username} is no longer an admin`,
    })
}
