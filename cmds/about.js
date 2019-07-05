const bot = require('../bot.js');

const command = {
	name: 'about',

	action: (msg) => {
		const aboutEmbed = {
			embed: {
				title: 'About SporkBOT',
				description: 'An spork-themed discord bot.',
				thumbnail: {
					url: bot.user.avatarURL,
				},
				fields: [
					{
						name: 'Developer',
						value: '**Snipey**#0001',
						inline: true,
					},
					{
						name: 'Library',
						value: '**Eris** 0.10.0',
						inline: true,
					},
				],
			},
		};

		return msg.channel.createMessage(aboutEmbed);
	},

	options: {
		cooldown: 1000,
		description: 'Diplay the about message!',
		usage: 'about',
	},
};

module.exports = command;