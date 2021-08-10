import { ApplicationCommandData } from 'discord.js'

import { EE_MINERALS } from '../eve_echoes/minerals'

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
      },
      {
        description: 'Manage industry settings',
        name: 'industry',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            description: 'Sets the channels your corp uses for purchasing and selling from industry',
            name: 'channels',
            type: 'SUB_COMMAND',
            options: [
              {
                description: 'The channel to use for purchasing from industry',
                name: 'buy_channel',
                required: true,
                type: 'CHANNEL'
              },
              {
                description: 'The channel to use for selling to industry',
                name: 'sell_channel',
                required: true,
                type: 'CHANNEL'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    description: 'Industry related commands',
    name: 'indy',
    options: [
      {
        description: 'Mineral specific indy commands',
        name: 'minerals',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            description: 'Purchase minerals from the corporation',
            name: 'buy',
            type: 'SUB_COMMAND',
            options: [
              {
                description: `Amount of ${EE_MINERALS.isogen}`,
                name: EE_MINERALS.isogen,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.megacyte}`,
                name: EE_MINERALS.megacyte,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.mexallon}`,
                name: EE_MINERALS.mexallon,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.morphite}`,
                name: EE_MINERALS.morphite,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.nocxium}`,
                name: EE_MINERALS.nocxium,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.pyerite}`,
                name: EE_MINERALS.pyerite,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.tritanium}`,
                name: EE_MINERALS.tritanium,
                type: 'NUMBER'
              },
              {
                description: `Amount of ${EE_MINERALS.zydrine}`,
                name: EE_MINERALS.zydrine,
                type: 'NUMBER'
              }
            ]
          }
        ]
      }
    ]
  }
]
