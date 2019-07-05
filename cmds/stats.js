const bot = require('../bot.js');

const command = {
	name: 'stats',

	action: (msg) => {


		let totalSeconds = process.uptime();

		const days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;

		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;

		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);

		const uptime = `\`${days} days, ${hours} hrs, ${minutes} min, ${seconds} sec\``;
		const statsEmbed = {
			embed: {
				title: 'About SporkBOT',
				color: 6068849,
				description: 'An spork-themed discord bot.',
				thumbnail: {
					url: bot.user.avatarURL,
				},
				fields: [
					{
						name: 'Uptime',
						value: uptime,
						inline: true,
					},
				],
			},
		};

		return msg.channel.createMessage(statsEmbed);
	},

	options: {
		cooldown: 1000,
		description: 'Diplay the stats message!',
		usage: 'stats',
	},
};

module.exports = command;