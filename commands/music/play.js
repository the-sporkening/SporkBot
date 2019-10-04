const { Command } = require('discord-akairo');
const { isURL } = require('../../util/parseUrl');
class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			category: 'music',
			description: {
				content: 'Plays the requested song or playlist',
				usage: '[song or url]',
				examples: ['Old Town Road', 'youtu.be/dAS3s31'],
			},
			args: [
				{
					id: 'query',
					type: 'string',
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
			channelRestriction: 'guild',
		});
	}

	async exec(msg, args) {
		// ;play <url | search term> <flags: --sc>

		// Check if you are in a channel
		if (!msg.member.voice.channelID) {
			return await msg.channel.send('You are not in a voice channel');
		}

		// Check if an argument is provided
		if (!args.song) {
			return await msg.channel.send('You did not specify a link or search term. type ;help music');
		}

		// Get the node to play on
		const node = this.client.shoukaku.getNode();

		// Check if url
		if (isURL()) {
			// link to song
			const link = args.song;
			// Resolve tracks
			const tracks = await node.rest.resolve(link);
			// Check if the url is valid
			if (!tracks) {
				return await msg.channel.send('I didn\'t find anything in the query you gave me');
			}
			// Check if URL is playlist
			const isPlaylist = Array.isArray(tracks) && tracks.name;
			// Add songs to queue 
			const res = isPlaylist ? await this.client.queue.handle(node, tracks.shift(), msg) : await this.client.queue.handle(node, tracks, msg);
			if (isPlaylist) {
				for (const track of tracks) await this.client.queue.handle(node, track, msg);
			}
			await msg.channel.send(isPlaylist ? `Added the playlist **${tracks.name}** in queue!` : `Added the track **${tracks.info.title}** in queue!`).catch(() => null);
			if (res) await res.play();
			return;
		}
		else {
			if (!args.query) {return await msg.channel.send('What is the search term you want me to search for?');}
			const tracks = await node.rest.resolve(args.slice(1).join(' '), type);
			if (!tracks.length) {return await msg.channel.send('I didn\'t find anything in the query you gave me');}
			const track = tracks.shift();
			const res = await this.client.queue.handle(node, track, msg);
			await msg.channel.send(`Added the track **${track.info.title}** in queue!`).catch(() => null);
			if (res) await res.play();
		}
	}
}

module.exports = PlayCommand;