const SporkDispatcher = require('./SporkDispatcher.js');

class Queue extends Map {
	constructor(client, iterable) {
		super(iterable);

		this.client = client;
	}

	async handle(node, track, msg) {
		const existing = this.get(msg.guild.id);
		if (!existing) {
			const player = await node.joinVoiceChannel({
				guildID: msg.guild.id,
				voiceChannelID: msg.member.voiceChannelID,
			});
			const dispatcher = new SporkDispatcher({
				client: this.client,
				guild: msg.guild,
				text: msg.channel,
				player,
			});
			dispatcher.queue.push(track);
			this.set(msg.guild.id, dispatcher);
			return dispatcher;
		}
		existing.queue.push(track);
		return null;
	}
}
module.exports = Queue;