const { Command, version: akairoVersion } = require('discord-akairo');
const { version: djsVersion } = require('discord.js');

class AboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ['about'],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	exec(message) {
		return message.channel.send([
			'Sporkbot is made by Snipey#0001',
			'Source code is available at <https://github.com/Snipey/SporkBot>.',
			'',
			'SporkBot Is a utensil themed discord bot.',
			'Check it out here <https://github.com/Snipey/SporkBot>.',
		]);
	}
}

module.exports = AboutCommand;