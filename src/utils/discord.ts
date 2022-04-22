import { CommandInteraction } from 'discord.js'

export type StringOrError = Promise<[string | null, Error | null]>

export const getFullHandlerName = (interaction: CommandInteraction, name = '', count = 0): string => {
  const group = interaction.options.getSubcommandGroup()
  if (group && count === 0) {
    name += group
    getFullHandlerName(interaction, name, count + 1)
  }

  const subCmd = interaction.options.getSubcommand()
  if (subCmd) {
    name += subCmd
  }

  return name
}

export const getGuildIdFromInteraction = async (interaction: CommandInteraction): StringOrError =>
  (!interaction.guild) ? [null, new Error('No guild ID for interaction')] : [interaction.guild.id, null]

export const respondToSlashCommandString = async (interaction: CommandInteraction, content: string, ephemeral = true) => 
  await interaction.reply({ content, ephemeral })
