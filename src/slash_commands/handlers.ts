import { Client, CommandInteraction } from 'discord.js'

import { adminHandler, adminCommandsHandler, adminCommandsSetHandler } from './admin'
import { indyBuyMineralsHandler, indyHandler, indyMineralsHandler } from './indy'

interface SlashCommandHandlers {
  [cmd: string]: (client: Client, interaction: CommandInteraction) => Promise<void>
}

export const SLASH_COMMAND_HANDLERS: SlashCommandHandlers = {
  admin: adminHandler,
  admincommands: adminCommandsHandler,
  admincommandsset: adminCommandsSetHandler,
  indy: indyHandler,
  indyminerals: indyMineralsHandler,
  indymineralsbuy: indyBuyMineralsHandler
}
