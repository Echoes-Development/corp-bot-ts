import { CommandInteraction } from 'discord.js'

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
