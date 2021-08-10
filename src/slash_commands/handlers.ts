import { Client, CommandInteraction } from 'discord.js'

import { adminCommandsSetHandler, adminIndustryChannelsHandler } from './admin'
import { indyBuyMineralsHandler } from './indy'

interface SlashCommandHandlers {
  [cmd: string]: (client: Client, interaction: CommandInteraction) => Promise<void>
}

export const SLASH_COMMAND_HANDLERS: SlashCommandHandlers = {
  admincommandsset: adminCommandsSetHandler,
  adminindustrychannels: adminIndustryChannelsHandler,
  indymineralsbuy: indyBuyMineralsHandler
}
