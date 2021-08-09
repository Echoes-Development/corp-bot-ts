import { Client, CommandInteraction } from 'discord.js'

export const indyHandler = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  try {
    await interaction.reply({
      content: 'Please select a sub command',
      ephemeral: true,
    })
  } catch (e) {
    console.error(e)
  }
}
