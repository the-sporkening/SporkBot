require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
    commandPrefix: '?',
    unknownCommandResponse: false,
    owner: '113086797872918528',
    disableEveryone: true
});
const mysql = require("mysql");
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['profile', ':candy:Profile Commands:candy:'],
        ['moderation', ':pencil2:Moderation Commands:pencil2:'],
        ['fun', ':candy:Fun Commands:candy:']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'cmd'));
client.on('ready', () => {
    client.user.setPresence({
        status: 'online',
        game: {
            name: 'WIP: Sporkbot V1',
            url: 'https://www.twitch.tv/snipey92',
            type: 'STREAMING'
    }}).catch(console.error);
    console.log(`Logged in as ${client.user.tag}!`);
});
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});
con.connect(err => {
    if(err) throw err;
    console.log("MySQL Connection Successful!");
});
function genXp(){
    const min = 20;
    const max = 30;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.on('message', (msg) => {
    if(msg.author.type === "bot") return;
    if(msg.channel.type === "dm") return;
    
});
client.login(process.env.DISCORD_TOKEN);