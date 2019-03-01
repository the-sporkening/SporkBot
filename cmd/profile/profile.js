'use strict';

// const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
// const level = require('../../util/levels.js');

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
					type: 'string',
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

		if(!profile) {
			// let user = msg.author;
		}
		else{
			// let user = msg.mentions.users.first();
		}

		// TODO Find users profile
		// TODO Find @user profile
		// TODO Display profile information
		/*
			const embed = new Discord.RichEmbed()
						.setTitle(user.username + '\'s Profile')
						.setThumbnail(user.avatarURL)
						.setColor('#103bff')
						.addField('XP: ', profile.xp, true)
						.addField('Level: ', level.getLevel(profile.xp, true), true)
						.addField('Coins: (coming soon)', profile.coins, true);
					msg.reply(embed);
			*/
	}
};
