import { Client, Guild } from 'discord.js'
import fb from '../firebase'

import { SLASH_COMMAND_DEFINITIONS } from '../slash_commands'
import { CMGuild } from '../types/guild'

export const guildCreate = async (client: Client, guild: Guild): Promise<void> => {
  try {
    await client.guilds.cache.get(guild.id)?.commands.set(SLASH_COMMAND_DEFINITIONS)
  } catch (e) {
    console.error('Unable to create guild slash commands', e)
  }

  try {
    const admins = [guild.ownerId]
    const me = guild.me?.id
    if (me && guild.ownerId !== me) {
      admins.push(me)
    }

    await fb.firestore()
      .collection('guilds')
      .doc(guild.id)
      .set({
        admins,
        name: guild.name,
        industry: {
          buyChannel: '',
          sellChannel: '',
        },
        resourcePrices: {
          ore: {
            arkonor: { buy: 0, sell: 0 },
            bistot: { buy: 0, sell: 0 },
            crokite: { buy: 0, sell: 0 },
            dark_ochre: { buy: 0, sell: 0 },
            gneiss: { buy: 0, sell: 0 },
            hedbergite: { buy: 0, sell: 0 },
            hemorphite: { buy: 0, sell: 0 },
            jaspet: { buy: 0, sell: 0 },
            kernite: { buy: 0, sell: 0 },
            mercoxit: { buy: 0, sell: 0 },
            omber: { buy: 0, sell: 0 },
            plagioclase: { buy: 0, sell: 0 },
            pyroxeres: { buy: 0, sell: 0 },
            scordite: { buy: 0, sell: 0 },
            spodumain: { buy: 0, sell: 0 },
            veldspar: { buy: 0, sell: 0 },
          },
          minerals: {
            isogen: { buy: 0, sell: 0 },
            megacyte: { buy: 0, sell: 0 },
            mexallon: { buy: 0, sell: 0 },
            morphite: { buy: 0, sell: 0 },
            nocxium: { buy: 0, sell: 0 },
            pyerite: { buy: 0, sell: 0 },
            tritanium: { buy: 0, sell: 0 },
            zydrine: { buy: 0, sell: 0 },
          },
          planetary: {
            base_metals: { buy: 0, sell: 0 },
            condensates: { buy: 0, sell: 0 },
            condensed_alloy: { buy: 0, sell: 0 },
            construction_blocks: { buy: 0, sell: 0 },
            coolant: { buy: 0, sell: 0 },
            crystal_compound: { buy: 0, sell: 0 },
            dark_compound: { buy: 0, sell: 0 },
            fiber_composite: { buy: 0, sell: 0 },
            gleaming_alloy: { buy: 0, sell: 0 },
            glossy_compound: { buy: 0, sell: 0 },
            heavy_metals: { buy: 0, sell: 0 },
            heavy_water: { buy: 0, sell: 0 },
            industrial_fibers: { buy: 0, sell: 0 },
            ionic_solutions: { buy: 0, sell: 0 },
            liquid_ozone: { buy: 0, sell: 0 },
            lucent_compound: { buy: 0, sell: 0 },
            lustering_alloy: { buy: 0, sell: 0 },
            motley_compound: { buy: 0, sell: 0 },
            nanites: { buy: 0, sell: 0 },
            noble_gas: { buy: 0, sell: 0 },
            noble_metals: { buy: 0, sell: 0 },
            opulent_compound: { buy: 0, sell: 0 },
            oxygen_isotopes: { buy: 0, sell: 0 },
            plasmoids: { buy: 0, sell: 0 },
            polyaramids: { buy: 0, sell: 0 },
            precious_alloy: { buy: 0, sell: 0 },
            reactive_gas: { buy: 0, sell: 0 },
            reactive_metals: { buy: 0, sell: 0 },
            sheen_compound: { buy: 0, sell: 0 },
            silicate_glass: { buy: 0, sell: 0 },
            smartfab_units: { buy: 0, sell: 0 },
            supertensile_plastics: { buy: 0, sell: 0 },
            suspended_plasma: { buy: 0, sell: 0 },
            toxic_metals: { buy: 0, sell: 0 },
          }
        }
      } as CMGuild)
  } catch (e) {
    console.error('Unable to create a new guild in DB', e)
  }
}
