import { ApplicationCommandData } from 'discord.js'

export const SLASH_COMMAND_DEFINITIONS: ApplicationCommandData[] = [
  {
    description: 'Controls this bot and its settings',
    name: 'admin',
    options: [
      {
        description: 'Manage server slash commands',
        name: 'commands',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            description: 'Updates your guilds slash commands to match global ones',
            name: 'set',
            type: 'SUB_COMMAND'
          }
        ]
      }
    ]
  }
]