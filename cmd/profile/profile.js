'use strict';

const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const User = require('../../models').User;
const level = require('../../util/levels.js');

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
				duration: 10,
			},
		});
	}

	run(msg, { profile }) {
		if(profile) {
			User.findOne({
				where: {
					user_id: profile.id,
					server_id: msg.guild.id,
				},
			}).then(result => {
				const query = result.dataValues;
				const embed = new Discord.RichEmbed()
					.setTitle(profile.username + '\'s Profile')
					.setThumbnail(profile.avatarURL)
					.setColor('#103bff')
					.addField('XP: ', query.xp, true)
					.addField('Level: ', level.getLevel(query.xp, true), true);
				msg.reply(embed).catch(err => console.log(err));
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
				msg.reply(embed).catch(err => console.log(err));
			});

			console.log('Not mentioned');
		}
		// TODO Find users profile
		// TODO Find @user profile
		// TODO Display profile information
	}
};
