const { Command } = require('discord-akairo');

class GuideCommand extends Command {
	constructor() {
		super('guide', {
			aliases: ['guide'],
			category: 'general',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Shows information about how to use Sporkbot.',
			},
		});
	}

	async exec(message) {

		const embed = this.client.util.embed()
			.setColor('#FFAC33')
			.setTitle('Guide to SporkBOT')
			.addField('Setup', [
				'SporkBOT requires the following permissions to be usable:',
				'- `Read Messages`',
				'- `Manage Messages`',
				'- `Read Message History`',
				'- `Send Messages`',
				'- `Embed Links`',
				'- `Manage Channels`',
			])
			.addField('Music', [
				'There are a few ways you can play music with SporkBOT',
				'',
				'Supported platforms:',
				'- `Youtube`',
				'- `Soundcloud`',
				'- `Twitch`',
				'- `Mixer`',
			]);

		const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');

		try {
			await message.author.send({ embed });
			if (shouldReply) message.util.reply('I\'ve sent you a DM with the guide.');
		}
		catch (err) {
			if (shouldReply) message.util.reply('I could not send you the guide in DMs.');
		}
	}
}

module.exports = GuideCommand;
