require('dotenv').config();
//const Discord = require('discord.js');
//const bot = new Discord.Client();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
    commandPrefix: '?',
    unknownCommandResponse: false,
    owner: '113086797872918528',
    disableEveryone: true
});
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['moderation', 'Moderation Commands'],
        ['fun', 'Fun Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'cmd'));
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        game: {
            name: 'Sporkbot V1',
            url: 'https://www.twitch.tv/snipey92',
            type: 'STREAMING'
    }}).catch(console.error);
});

client.on('message', (msg) => {
    if(msg.author.type === "bot") return;
    if(msg.channel.type === "dm") return;
});
client.login(process.env.DISCORD_TOKEN);