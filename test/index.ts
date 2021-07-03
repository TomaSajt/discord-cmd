import { Client } from 'discord.js'
import dotenv from 'dotenv'
import { CombinedHandler } from '../src/index'
dotenv.config()
const client = new Client()
client.login(process.env.BOT_TOKEN)
client.on('ready', () => {
    console.log('Successfully logged in')
})

client.on('message', (aa) => {
    console.log('got the message')
})
