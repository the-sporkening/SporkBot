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

/*Levels.findOne({
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
});*/
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
    if (!debug) {
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
client.on('raw', event => {
   const eventName = event.t;
   if(eventName === 'MESSAGE_REACTION_ADD'){
       if(event.d.message_id === '544764878632779789'){
            let reactionChannel = client.channels.get(event.d.channel_id);
            if(reactionChannel.messages.has(event.d.message_id)){
                return;
            }else{
                reactionChannel.fetchMessage(event.d.message_id)
                    .then(msg => {
                        let msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
                        let user = client.users.get(event.d.user_id);
                        client.emit('messageReactionAdd', msgReaction, user);
                        //console.log(msgReaction);
                    })
                    .catch(err => console.log(err));
                //console.log(event.d.emoji);
            }
       }
   }
});
//{ name: 'sporkapex', id: '544763660212633610', animated: false }
client.on('messageReactionAdd', (messageReaction, user) => {
    //Get the reaction from the user
    let roleName = 'Apex Legends';
    let role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    //console.log(role.id);
    let reaction = messageReaction.emoji.id;
    //console.log(reaction);
    if(reaction === '544763660212633610'){
        if(debug) console.log("Role Reaction " + roleName + " Detected");
        let member = messageReaction.message.guild.members.find(member => member.id === user.id);
        if(member){
            //Add the role
            member.addRole(role.id).catch(err => console.log(err));
        }
    }
});
client.on('messageReactionRemove', (messageReaction, user) => {
    //Role Name
    let roleName = 'Apex Legends';
    let role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    //Get the reaction from the user
    let reaction = messageReaction.emoji.id;
    if(reaction === '544763660212633610'){
        let member = messageReaction.message.guild.members.find(member => member.id === user.id);
        if(member){
            //Remove the role
            member.removeRole(role.id).catch(err => console.log(err));
        }
    }

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
            const curLvl = levels.getLevel(profile.xp, true);
            const nextLvl = curLvl + 1;
            profile.xp = profile.xp + xpToAdd;
            profile.save().catch(err => console.log(err));
            const newLvl = levels.getLevel(profile.xp, true);
            //If the new level equals the next level send message that the user leveled up
            if (newLvl === nextLvl) {
                let embed = new Discord.RichEmbed()
                    .setTitle(msg.author.username + " Leveled Up!")
                    .setColor("#a100ff")
                    .addField("You have reached Level: ", curLvl + 1, true)
                    .setThumbnail(msg.author.avatarURL);
                msg.reply(embed).then(msg => {
                    msg.delete(10000);
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
        //let xpGained;
        VoiceXP.findOne({
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