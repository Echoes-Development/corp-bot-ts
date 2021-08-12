import {ApplicationCommandData} from 'discord.js'

import {EE_MINERALS} from '../eve_echoes/minerals'
import {IndyTypes} from "../types/indy";

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
        description: 'Control who has access to configure this bot',
        name: 'admins',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            description: 'Add an admin to control this bot',
            name: 'add',
            type: 'SUB_COMMAND',
            options: [
              {
                description: 'The user you want to add as an admin',
                name: 'user',
                required: true,
                type: 'USER'
              }
            ]
          },
          {
            description: 'Remove an admin that controls this bot',
            name: 'delete',
            type: 'SUB_COMMAND',
            options: [
              {
                description: 'The user you want to remove admin permissions from',
                name: 'user',
                required: true,
                type: 'USER'
              }
            ]
          }
        ]
      },
      {
        description: 'Manage industry settings',
        name: 'industry',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            description: 'Sets the roles for industry related tasks',
            name: 'roles',
            type: 'SUB_COMMAND',
            options: [
              {
                description: 'The role you want to add for industry tasks',
                name: 'role',
                required: true,
                type: 'ROLE'
              },
              {
                description: 'The CorpBot industry type this role will perform',
                name: 'type',
                required: true,
                type: 'STRING',
                choices: [
                  {
                    name: 'Blueprint Research',
                    value: IndyTypes.BP_MANU
                  },
                  {
                    name: 'Battleship Manufacturing',
                    value: IndyTypes.SHIP_MANU_BATTLESHIP
                  },
                  {
                    name: 'Battlecruiser Manufacturing',
                    value: IndyTypes.SHIP_MANU_BCRUISER
                  },
                  {
                    name: 'Cruiser Manufacturing',
                    value: IndyTypes.SHIP_MANU_CRUISER
                  },
                  {
                    name: 'Destroyer Manufacturing',
                    value: IndyTypes.SHIP_MANU_DESTROYER
                  },
                  {
                    name: 'Frigate Manufacturing',
                    value: IndyTypes.SHIP_MANU_FRIGATE
                  },
                  {
                    name: 'Resource Management',
                    value: IndyTypes.ORDER_FULFILLMENT
                  },
                  {
                    name: 'Rig Manufacturing',
                    value: IndyTypes.RIG_MANU
                  },
                  {
                    name: 'Structure Manufacturing',
                    value: IndyTypes.STRUCTURE_MANU
                  }
                ]
              },
            ]
          },
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
