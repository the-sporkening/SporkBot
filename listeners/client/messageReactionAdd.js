const { Listener } = require('discord-akairo');

class MessageReactionAddListener extends Listener {
	constructor() {
		super('messageReactionAdd', {
			event: 'messageReactionAdd',
			emitter: 'client',
			category: 'client',
		});
	}

	async exec(reaction, user) {
		// Check if reaction is not added by the bot
		if (user.id === this.client.user.id) return;
		// Fetch message reacted to
		if (reaction.message.partial) await reaction.message.fetch();
		// Break the event if the reaction is not in a guild
		if (!reaction.message.guild) return;
	}
}

module.exports = MessageReactionAddListener;