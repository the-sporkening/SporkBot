const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');

class AboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ['about'],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	exec(message) {
		const embed = new MessageEmbed()
			.setColor(0xFFAC33)
			.setTitle('About SporkBot')
			.addField('Owner', [
				'**Discord**: Snipey#0001',
				'**Twitter**: https://twitter.com/snipeydev',
				'**Patreon**: https://patreon.com/snipeydev',
			], true);

		return message.channel.send(embed);
	}
}

module.exports = AboutCommand;