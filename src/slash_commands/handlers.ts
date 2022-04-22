import { Client, CommandInteraction } from 'discord.js'

import {
  adminCommandsSetHandler,
  adminIndustryChannelsHandler,
  adminIndustryRolesHandler,
  adminsAddHandler,
  adminsDeleteHandler
} from './admin'
import { 
  indyBuyMineralsHandler,
  indySellOreHandler,
 } from './indy'

interface SlashCommandHandlers {
  [cmd: string]: (client: Client, interaction: CommandInteraction) => Promise<void>
}

export const SLASH_COMMAND_HANDLERS: SlashCommandHandlers = {
  adminadminsadd: adminsAddHandler,
  adminadminsdelete: adminsDeleteHandler,
  admincommandsset: adminCommandsSetHandler,
  adminindustrychannels: adminIndustryChannelsHandler,
  adminindustryroles: adminIndustryRolesHandler,
  indymineralsbuy: indyBuyMineralsHandler,
  indyoresell: indySellOreHandler,
}
