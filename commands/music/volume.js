const { Command } = require('discord-akairo');

class VolumeCommand extends Command {
	constructor() {
		super('volume', {
			aliases: ['volume', 'vol', 'v'],
			category: 'music',
			args: [{
				id: 'number',
			}],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	async exec(msg, args) {
		if (!msg.member.voice.channelID) {return await msg.channel.send('Admiral, you are not in a voice channel to perform this');}
		const dispatcher = this.client.queue.get(msg.guild.id);
		if (!dispatcher) {
			return await msg.channel.send('Nothing is playing in this guild.');
		}
		if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID) {
			return await msg.channel.reply(', you are not in the same voice channel where I am.');
		}
		if (!args.number || isNaN(args.number)) {
			return await msg.channel.send(`The playback volume is currently at **${dispatcher.link.player.volume}%**`);
		}
		const volume = Number(args.number);
		if (volume < 10 || volume > 100) {
			return await msg.channel.send('Please type a number between 10-100');
		}
		await dispatcher.player.setVolume(volume);
		await msg.channel.send(`The playback volume is now set to **${volume}%**`);
	}
}

module.exports = VolumeCommand;