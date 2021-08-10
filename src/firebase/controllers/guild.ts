import fb from '../'
import { CMGuild } from '../../types/guild'

// TODO: Make these generics
type BoolOrError = [boolean | null, Error | null]
type GuildOrError = [CMGuild | null, Error | null]

const getGuild = async (guildId: string): Promise<GuildOrError> => {
  try {
    const guild = await fb.firestore()
      .collection('guilds')
      .doc(guildId)
      .get()
      .then((resp): CMGuild => resp.data() as CMGuild)
    return [guild, null]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to query for guild')]
  }
}

const updateGuild = async (guildId: string, updates: Object): Promise<BoolOrError> => {
  try {
    await fb.firestore()
      .collection('guilds')
      .doc(guildId)
      .update(updates)
    return [true, null]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to update guild')]
  }
}

export {
  getGuild,
  updateGuild
}
