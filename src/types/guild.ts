import { CMResources } from './resources'

export interface CMGuild {
  admins: string[],
  name: string,
  resourcePrices: CMResources
}
