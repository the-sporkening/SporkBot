'use strict';

const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const User = require('../../models').User;
const level = require('../../util/levels.js');
const Rollbar = require('rollbar');
const rollbar = new Rollbar({
	accessToken: '48240675527e4d47933f2f5e3124f786',
	captureUncaught: true,
	captureUnhandledRejections: true,
});

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'profile',
			memberName: 'profile',
			description: 'Displays the users profile',
			examples: ['profile, p'],
			aliases: ['profile', 'p'],
			args: [
				{
					key: 'profile',
					prompt: 'Whose profile?',
					type: 'user',
					default: '',
				},
			],
			throttling: {
				usages: 2,
				duration: 30,
			},
		});
	}

	run(msg, { profile }) {
		const user = msg.mentions.users.first();
		if(profile) {
			User.findOne({
				where: {
					user_id: user.id,
					server_id: msg.guild.id,
				},
			}).then(result => {
				const query = result.dataValues;
				const embed = new Discord.RichEmbed()
					.setTitle(user.username + '\'s Profile')
					.setThumbnail(user.avatarURL)
					.setColor('#103bff')
					.addField('XP: ', query.xp, true)
					.addField('Level: ', level.getLevel(query.xp, true), true);
				msg.reply(embed)
					.then(() => { msg.delete(10000); })
					.catch(err => rollbar.log(err));
			});
		}
		else {
			User.findOne({
				where: {
					user_id: msg.author.id,
					server_id: msg.guild.id,
				},
			}).then(result => {
				const query = result.dataValues;
				const embed = new Discord.RichEmbed()
					.setTitle(msg.author.username + '\'s Profile')
					.setThumbnail(msg.author.avatarURL)
					.setColor('#103bff')
					.addField('XP: ', query.xp, true)
					.addField('Level: ', level.getLevel(query.xp, true), true);
				msg.reply(embed).catch(err => rollbar.log(err));
			});
		}
	}
};
