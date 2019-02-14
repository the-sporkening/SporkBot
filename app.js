'use strict';

require('dotenv').config();
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const mongoose = require('mongoose');

const debug = process.env.DEBUG;
const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  unknownCommandResponse: false,
  owner: '113086797872918528',
  disableEveryone: true,
});
const cdSeconds = 5;
const cdSet = new Set();

//
// Mongo Stuff


mongoose.connect('mongodb://sporkbot:SporkBot123@ds335275.mlab.com:35275/heroku_3x6dn575', {
  useNewUrlParser: true,
});
const Profile = require('./models/profile');
const VoiceXP = require('./models/voicexp');
const levels = require('./util/levels');
//
// Registers things
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['profile', ':candy:Profile Commands:candy:'],
    ['dev', ':pencil1:Dev Commands:pencil1:'],
    ['moderation', ':pencil2:Moderation Commands:pencil2:'],
    ['fun', ':candy:Fun Commands:candy:'],
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
      type: 'LISTENING',
    },
  }).catch(console.error);
  //
  // Title
  if (!debug) {
    console.log('\n' +
      '  ___               _   ___      _    __   ___ \n' +
      ' / __|_ __  ___ _ _| |_| _ ) ___| |_  \\ \\ / / |\n' +
      ' \\__ \\ \'_ \\/ _ \\ \'_| / / _ \\/ _ \\  _|  \\ V /| |\n' +
      ' |___/ .__/\\___/_| |_\\_\\___/\\___/\\__|   \\_/ |_|\n' +
      '     |_|                                       \n');
    console.log('=======================================================================');
  }
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('raw', (event) => {
  const eventName = event.t;
  if (eventName === 'MESSAGE_REACTION_ADD') {
    if (event.d.message_id === '544764878632779789') {
      const reactionChannel = client.channels.get(event.d.channel_id);
      if (reactionChannel.messages.has(event.d.message_id)) {
      } else {
        reactionChannel.fetchMessage(event.d.message_id)
          .then(msg => {
            const msgReaction = msg.reactions.get(event.d.emoji.name + ':' + event.d.emoji.id);
            const user = client.users.get(event.d.user_id);
            client.emit('messageReactionAdd', msgReaction, user);
          })
          .catch(err => console.log(err));
      }
    }
  }
});
//
// { name: 'sporkapex', id: '544763660212633610', animated: false }
client.on('messageReactionAdd', (messageReaction, user) => {
  //
  // Get the reaction from the user
  const roleName = 'Apex Legends';
  const role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

  const reaction = messageReaction.emoji.id;

  if (reaction === '544763660212633610') {
    const member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (member) {
      //
      // Add the role
      member.addRole(role.id).catch(err => console.log(err));
    }
  }
});
client.on('messageReactionRemove', (messageReaction, user) => {
  //
  // Role Name
  const roleName = 'Apex Legends';
  const role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
  //
  // Get the reaction from the user
  const reaction = messageReaction.emoji.id;
  if (reaction === '544763660212633610') {
    let member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (member) {
      //
      // Remove the role
      member.removeRole(role.id).catch(err => console.log(err));
    }
  }
});
client.on('message', (msg) => {
  if (msg.author.type === 'bot') return;
  if (msg.channel.type === 'dm') return;
  if (msg.author.id === '437724584192770050') return;
  if (msg.guild.id !== ('128797258287153152')) return;
  const xpToAdd = levels.genXp(5, 12);
  Profile.findOne({
    userId: msg.author.id,
    serverId: msg.guild.id,
  }, (err, profile) => {
    if (err) console.log(err);
    if (!profile) {
      const newProfile = new Profile({
        _id: mongoose.Types.ObjectId(),
        userId: msg.author.id,
        serverId: msg.guild.id,
        xp: xpToAdd,
      });
      newProfile.save().catch(err => console.log(err));
      cdSet.add(msg.author.id);
      setTimeout(() => {
        cdSet.delete(msg.author.id);
        console.log('Cooldown expired for ' + msg.author.id);
      }, cdSeconds * 1000);
      console.log((cdSet));
    } else {
      if (!cdSet.has(msg.author.id)) {
        const curLvl = levels.getLevel(profile.xp, true);
        const nextLvl = curLvl + 1;
        profile.xp = profile.xp + xpToAdd;
        profile.save().catch(err => console.log(err));
        const newLvl = levels.getLevel(profile.xp, true);
        cdSet.add(msg.author.id);
        setTimeout(() => {
          cdSet.delete(msg.author.id);
        }, cdSeconds * 1000);
        //
        // If the new level equals the next level send message that the user leveled up
        if (newLvl === nextLvl) {
          const embed = new Discord.RichEmbed()
            .setTitle(msg.author.username + ' Leveled Up!')
            .setColor('#a100ff')
            .addField('You have reached Level: ', curLvl + 1, true)
            .setThumbnail(msg.author.avatarURL);
          msg.reply(embed).then(msg => {
            msg.delete(10000);
          });
        }
      }
    }
  });
});
//
// Add Xp for being in a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {

  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  if (oldUserChannel === undefined && newUserChannel !== undefined) {
    //
    // Add Xp for being in a voice channel
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
        //
        // msg.reply("VoiceXP exists already!");
      }
    });
  } else if (newUserChannel === undefined) {
    // User leaves a voice channel
    //
    // let xpGained;
    let finalXpAdd = 0;
    VoiceXP.findOne({
      userId: oldMember.user.id,
      serverId: oldUserChannel.guild.id
    }, (err, voicexp) => {
      if (err) console.log(err);
      if (voicexp) {
      {
        const startDate = voicexp.timeJoined;
        const endDate = new Date();
        const seconds = Math.round((endDate.getTime() - startDate) / 1000);
        const minutes = seconds / 60;
        const percMin = Math.round(minutes / 0.85);
        const xp = levels.genXp((minutes - percMin), minutes);
        const xpToAdd = Math.round(xp * 1.13);
        finalXpAdd = xpToAdd;
        voicexp.remove(function(err) {
          if (err) throw err;
          console.log('User successfully deleted!');
        });
      }
    });
    Profile.findOne({
      userId: oldMember.user.id,
      serverId: oldUserChannel.guild.id
    }, (err, profile) => {
      if (err) console.log(err);
      if (!profile) {
        //
        // If not exist
        console.log('User not in channel!');
      } else {
        const curLvl = levels.getLevel(profile.xp, true);
        const nextLvl = curLvl + 1;
        profile.xp = profile.xp + finalXpAdd;
        profile.save().catch(err => console.log(err));
        const newLvl = levels.getLevel(profile.xp, true);
        //
        // If the new level equals the next level send message that the user leveled up
        if (newLvl === nextLvl) {
          const embed = new Discord.RichEmbed()
            .setTitle(oldMember.user.username + ' Leveled Up!')
            .setColor('#a100ff')
            .addField('You have reached Level: ', curLvl + 1, true)
            .setThumbnail(msg.author.avatarURL);
          oldMember.message.reply(embed).then(msg => {
            msg.delete(10000);
          });
        }
      }
    });

    //Debug
    //if (debug === "TRUE") console.log(oldMember.user.username + " Left " + oldUserChannel.name + " on " + oldUserChannel.guild.name);
    //if (debug === "TRUE") console.log(oldMember.user.username + " Earned " + xpGained + " in " + oldUserChannel.guild.name);
  }
});
client.login(process.env.DISCORD_TOKEN).catch();