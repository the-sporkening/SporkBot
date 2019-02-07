require('dotenv').config();
const Discord = require("discord.js");
const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const debug = process.env.DEBUG;
const client = new CommandoClient({
    commandPrefix: process.env.PREFIX,
    unknownCommandResponse: false,
    owner: '113086797872918528',
    disableEveryone: true
});
//Mongo Stuff
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/sporkbot', {
    useNewUrlParser: true
});
const Profile = require("./models/profile");
const VoiceXP = require("./models/voicexp");
const levels = require("./util/levels");
//Registers things
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

//Checks to see if the bot is ready
client.on('ready', () => {
    client.user.setPresence({
        status: 'online',
        game: {
            name: 'your every word',
            url: 'https://www.twitch.tv/snipey92',
            type: 'LISTENING'
        }
    }).catch(console.error);
    //Title
    if (!process.env.DEBUG) {
        console.log("\n" +
            "  ___               _   ___      _    __   ___ \n" +
            " / __|_ __  ___ _ _| |_| _ ) ___| |_  \\ \\ / / |\n" +
            " \\__ \\ '_ \\/ _ \\ '_| / / _ \\/ _ \\  _|  \\ V /| |\n" +
            " |___/ .__/\\___/_| |_\\_\\___/\\___/\\__|   \\_/ |_|\n" +
            "     |_|                                       \n");
        console.log("=======================================================================");
    }
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', (msg) => {
    if (msg.author.type === "bot") return;
    if (msg.channel.type === "dm") return;
    if (msg.author.id === "437724584192770050") return;
    if (msg.guild.id !== "535881918483398676") return;
    const xpToAdd = levels.genXp();
    Profile.findOne({
        userId: msg.author.id,
        serverId: msg.guild.id
    }, (err, profile) => {
        if (err) console.log(err);
        if (!profile) {
            const newProfile = new Profile({
                _id: mongoose.Types.ObjectId(),
                userId: msg.author.id,
                serverId: msg.guild.id,
                xp: xpToAdd
            });
            newProfile.save().catch(err => console.log(err));
        } else {

            const nextLvl = levels.level(profile.xp, true) + 1;
            console.log(profile.xp);
            profile.xp = profile.xp + xpToAdd;
            profile.save().catch(err => console.log(err));
            console.log(
                "Current: " + curLvl + "\n" +
                "Next: " + nextLvl
            );
            if (curLvl === nextLvl) {
                let embed = new Discord.RichEmbed()
                    .setAuthor(msg.author.username)
                    .setColor("#a100ff")
                    .addField("Level Up!", curLvl);
                msg.channel.send(embed).then(msg => {
                    msg.delete(10000)
                });
            }
        }
    })
});
//Add Xp for being in a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {

        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            //Add Xp for being in a voice channel
            const join = new Date();
            VoiceXP.findOne({
                userId: newMember.user.id,
                serverId: newUserChannel.guild.id
            }, (err, voicexp) => {
                if (err) console.log(err);
                if (!voicexp) {
                    const newVoiceXp = new VoiceXP({
                        _id: mongoose.Types.ObjectId(),
                        userId: newMember.user.id,
                        serverId: newMember.guild.id,
                        timeJoined: new Date()
                    });
                    newVoiceXp.save().catch(err => console.log(err));
                } else {
                    msg.reply("VoiceXP exists already!");
                }
            });

            // User Joins a voice channel
            if (debug === "TRUE") console.log(newMember.user.username + " Joined " + newUserChannel.name + " on " + newUserChannel.guild.name + " at: " + join.getTime());
            //console.log("Joined " + oldUserChannel.name);

        } else if (newUserChannel === undefined) {
            // User leaves a voice channel
            let xpGained;
            VoiceXP.findOneAndDelete({
                userId: oldMember.user.id,
                serverId: oldUserChannel.guild.id
            }, (err, voicexp) => {
                if (err) console.log(err);
                if (!voicexp) {
                    msg.reply("VoiceXP does not exist");
                } else {
                    let startDate = voicexp.timeJoined;

                    let endDate = new Date();
                    let seconds = (endDate.getTime() - startDate) / 1000;
                    console.log(seconds);
                }
            });

            //Debug
            if (debug === "TRUE") console.log(oldMember.user.username + " Left " + oldUserChannel.name + " on " + oldUserChannel.guild.name);
            if (debug === "TRUE") console.log(oldMember.user.username + " Earned " + xpGained + " in " + oldUserChannel.guild.name);
        }
    });
    client.login(process.env.DISCORD_TOKEN).catch();