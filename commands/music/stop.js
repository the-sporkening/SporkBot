const { Command } = require('discord-akairo');

class StopCommand extends Command {
	constructor() {
		super('stop', {
			aliases: ['stop', 'end'],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	async exec(msg) {
		if (!msg.member.voiceChannelID) {return await msg.channel.send('Admiral, you are not in a voice channel to perform this');}
		const dispatcher = this.client.queue.get(msg.guild.id);
		if (!dispatcher) {return await msg.channel.send('Nothing is playing in this guild.');}
		if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID) {return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');}
		dispatcher.queue.length = 0;
		await dispatcher.player.stopTrack();
	}
}

module.exports = StopCommand;