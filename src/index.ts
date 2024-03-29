import * as dotenv from 'dotenv'
dotenv.config()

import { getClient } from './client'

async function main() {
  try {
    const { BOT_TOKEN } = process.env
    const client = getClient()
    await client.login(BOT_TOKEN)
  } catch (e) {
    console.error("Unable to start Discord session", e)
    process.exit(1)
  }
}

main()
