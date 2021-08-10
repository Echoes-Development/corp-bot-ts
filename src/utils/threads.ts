import { TextChannel, ThreadChannel } from 'discord.js'
import { DataOrError } from '../types/error_returns'

const getThread = async (channel: TextChannel, threadId: string): Promise<DataOrError<ThreadChannel>> => {
  try {
    const thread = await channel.threads.cache.get(threadId)
    return (thread) ? [thread, null] : [null, new Error('Not found')]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to fetch thread')]
  }
}

const createThread = async (
  channel: TextChannel,
  name: string,
  reason: string,
  archiveDuration: 60 | 1440 | 4320 | 10080
): Promise<DataOrError<ThreadChannel>> => {
  try {
    const thread = await channel.threads.create({
      autoArchiveDuration: archiveDuration,
      name,
      reason,
    })
    return [thread, null]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to create thread')]
  }
}

const addMembersToThread = async (
  thread: ThreadChannel,
  userIdsToAdd: string[]
): Promise<DataOrError<boolean>> => {
  try {
    await Promise.all(userIdsToAdd.map(async (id) => {
      await thread.members.add(id)
    }))
    return [true, null]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to add users to thread')]
  }
}

export {
  addMembersToThread,
  createThread,
  getThread
}
