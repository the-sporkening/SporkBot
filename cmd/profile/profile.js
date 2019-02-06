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
        });
    }

    run(msg, {name}) {
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
                    .addField("Level: ", level.calc(profile.xp, true), true);
                msg.reply(embed);
            }
        });
    }
};
