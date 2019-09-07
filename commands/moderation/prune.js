const { Command } = require('discord-akairo');
const pluralize = require('pluralize');
class PruneCommand extends Command {
	constructor() {
		super('prune', {
			aliases: ['prune'],
			category: 'moderation',
			args: [
				{
					id: 'count',
					type: 'number',
				},
			],
			channelRestriction: 'guild',
			cooldown: 5000,
			clientPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
			userPermissions: 'MANAGE_MESSAGES',

		});
	}

	async exec(message, args) {
		const channel = message.channel;
		const count = args.count;
		const messageCount = pluralize('message', count, true);
		if (channel.type === 'dm') {
			return message.channel.send('This command cannot be used in direct messages.');
		}
		if (count > 99 || !count) {
			return message.channel.send('You either didn\'t enter a number, or you entered a number larger than 99. ' + 'Please try again.');
		}
		try {
			const messages = await message.channel.fetchMessages({ limit: count + 1 });
			await message.channel.bulkDelete(messages, true);
			await message.channel.send(`Deleting ${messageCount}, please wait...`).then((msg) => {
				msg.edit(`Deleted ${messageCount}.`).then(res => res.delete({ timeout: 15000 }));
			});
			this.client.logger.info(`Deleted ${messageCount} from #${channel.name} in the guild ${message.guild}.`);
		}
		catch (err) {
			this.client.logger.error(`Unable to delete messages!\n\n${err}`);
			message.channel.send(`Sorry, I was unable to delete any messages!\n\`\`\`${err}\`\`\``);
		}
	}
}

module.exports = PruneCommand;