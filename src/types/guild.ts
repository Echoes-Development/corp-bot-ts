import { CMResources } from './resources'

export interface CMGuild {
  admins: string[],
  name: string,
  industry: {
    buyChannel: string,
    sellChannel: string
  }
  resourcePrices: CMResources
}
