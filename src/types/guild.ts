import { CMResources } from './resources'

export interface CMGuild {
  admins: string[],
  name: string,
  industry: {
    buyChannel: string,
    roleBP: string,
    roleFulfillment: string,
    roleHead: string,
    roleRig: string,
    roleShipBattleship: string,
    roleShipBcruiser: string,
    roleShipCapital: string,
    roleShipCruiser: string,
    roleShipDestroyer: string,
    roleShipFrigate: string,
    roleStructure: string,
    sellChannel: string
  },
  isSetup: boolean,
  resourcePrices: CMResources
}
