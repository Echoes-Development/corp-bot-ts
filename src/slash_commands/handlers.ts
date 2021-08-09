import {
  adminHandler,
  adminCommandsHandler,
  adminCommandsSetHandler
} from './admin'
import { Client, CommandInteraction } from 'discord.js'

interface SlashCommandHandlers {
  [cmd: string]: (client: Client, interaction: CommandInteraction) => Promise<void>
}

export const SLASH_COMMAND_HANDLERS: SlashCommandHandlers = {
  admin: adminHandler,
  admincommands: adminCommandsHandler,
  admincommandsset: adminCommandsSetHandler,
}
