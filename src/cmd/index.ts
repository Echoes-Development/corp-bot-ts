import { Command } from 'commander'
import * as dotenv from 'dotenv'

import { deleteGuildCommands } from './delete_guild_commands'
import { getGuildCommands } from './get_guild_commands'

dotenv.config()

const program = new Command()

program.version('0.0.1')
program.option(
  '--commands <guildId>',
  'gets the slash commands for a specific guild',
  (guildId) => getGuildCommands(guildId)
)
program.option(
  '--commands-delete <guildId>',
  'deletes the slash commands for a specific guild',
  (guildId) => deleteGuildCommands(guildId)
)
program.parse()

const options = program.opts()

