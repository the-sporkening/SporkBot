const { Command } = require('discord-akairo');
const ytRegex = require('youtube-regex');
class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			split: 'quoted',
			args: [
				{
					id: 'query',
					type: 'string',
				},
				{
					id: 'search',
					type: ['youtube', 'soundcloud'],
					match: 'option',
					flag: 'search:',
					default: 'youtube',
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
		});
	}

	async exec(message, args) {
		// ;play <url | search term> <search:PROVIDER_HERE>
		// Check if user is in voice channel <- DONE
		// Check if args contain a string or url <- DONE
		// Validate url <- DONE
		// If no input return error <- DONE
		// Check if url is a playlist
		// Loop through playlist and add tracks
		// Else add song to queue
		// Play the song
		const query = args.query;
		const search = args.search;

		if (!message.member.voiceChannelID) {
			return await message.channel.send('You need to join a voice channel before you can do that!');
		}
		const node = this.client.shoukaku.getNode();
		if (!search) {
			const tracks = await node.rest.resolve(args.query, search);
			if (!tracks.length) {
				return await message.channel.send('Admiral, I didn\'t find anything in the query you gave me');
			}
			const track = tracks.shift();
			const res = await this.client.queue.handle(node, track, message);
			await message.channel.send(`Added the track **${track.info.name}** in queue!`).catch(() => null);
			if (res) await res.play();
		// return await message.channel.send('SUH DUD ' + query + ' WORKS!!!');
		}
		else {
			// if (ytRegex().test(query)) {
			// 	const link = args.url;
			// 	const tracks = await node.rest.resolve(link);
			// 	if (!tracks) {
			// 		return await message.channel.send(', I didn\'t find anything in the query you gave me');
			// 	}
			// }
		}

		// HUGE MESS
		// const msg = message;
		// if (!msg.member.voiceChannelID) {
		// 	return await msg.author.reply(', you are not in a voice channel');
		// }
		// if (!args.url) {
		// 	return await msg.author.reply(', you did not specify a link or search mode');
		// }
		// const node = this.client.shoukaku.getNode();
		// if (args.option === 'youtube' || args.option === 'soundcloud') {
		// 	const link = args.url;
		// 	const tracks = await node.rest.resolve(link);
		// 	if (!tracks) {
		// 		return await msg.author.reply(', I didn\'t find anything in the query you gave me');
		// 	}
		// 	const isPlaylist = Array.isArray(tracks) && tracks.name;
		// 	const res = isPlaylist ? await this.client.queue.handle(node, tracks.shift(), msg) : await this.client.queue.handle(node, tracks, msg);
		// 	if (isPlaylist) {
		// 		for (const track of tracks) await this.client.queue.handle(node, track, msg);
		// 	}
		// 	await msg.author.reply(isPlaylist ? `Added the playlist **${tracks.name}** in queue!` : `Added the track **${tracks.info.name}** in queue!`).catch(() => null);
		// 	if (res) await res.play();
		// 	return;
		// }
		// if (!args.url) {
		// 	return await msg.author.reply(', what is the search term you want me to search for?');
		// }
		// const type = args[0].split(':')[1];
		// const tracks = await node.rest.resolve(args.slice(1).join(' '), type);
		// if (!tracks.length) {
		// 	return await msg.author.reply(', I didn\'t find anything in the query you gave me');
		// }
		// const track = tracks.shift();
		// const res = await this.client.queue.handle(node, track, msg);
		// await msg.author.reply(`Added the track **${track.info.name}** in queue!`).catch(() => null);
		// if (res) await res.play();
	}
}

module.exports = PlayCommand;