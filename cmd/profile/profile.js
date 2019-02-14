const Discord = require("discord.js");
const {Command} = require('discord.js-commando');
const Profile = require("../../models/profile.js");
const level = require("../../util/levels.js");

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'profile',
            memberName: 'profile',
            description: 'Displays the users profile',
            examples: ['profile, p'],
            aliases: ['profile, p'],
            args: [
                {
                    key: 'profile',
                    prompt: 'Whose profile?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, profile) {
        let user = msg.mentions.users.first();
        //console.log(user);
        if (user) {
            Profile.findOne({
                userId: user.id,
                serverId: msg.guild.id
            }, (err, profile) => {
                if (err) console.log(err);
                if (!profile) {
                    msg.reply("Profile does not exist!!!!!! yet");
                } else {
                    let embed = new Discord.RichEmbed()
                        .setTitle(user.username + "'s Profile")
                        .setThumbnail(user.avatarURL)
                        .setColor("#103bff")
                        .addField("XP: ", profile.xp, true)
                        .addField("Level: ", level.getLevel(profile.xp, true), true)
                        .addField("Coins: (coming soon)", profile.coins, true);
                    msg.reply(embed);
                    if (err) console.log(err);
                }
            });
        } else {
            Profile.findOne({
                userId: msg.author.id,
                serverId: msg.guild.id
            }, (err, profile) => {
                if (err) console.log(err);
                if (!profile) {
                    msg.reply("Profile does not exist..... yet");
                } else {
                    let embed = new Discord.RichEmbed()
                        .setTitle(msg.author.username + "'s Profile")
                        .setThumbnail(msg.author.avatarURL)
                        .setColor("#103bff")
                        .addField("XP: ", profile.xp, true)
                        .addField("Level: ", level.getLevel(profile.xp, true), true)
                        .addField("Coins: ", profile.coins, true);
                    msg.reply(embed);
                }
            });
        }

    }
};
