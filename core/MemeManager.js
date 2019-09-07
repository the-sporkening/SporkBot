const { RichEmbed } = require('discord.js');
const Logger = require('../util/Logger');
const createMeme = function(msg) {
	if (msg.author.bot) return;
	const memeEmbed = msg.embeds[0];
	const memeAttach = msg.attachments;
	const msgTime = 5 * 1000;
	let embed;
	if (memeAttach.length === 1) {
		embed = new RichEmbed()
			.setImage(memeAttach[0].proxyURL)
			.setAuthor(msg.author.username)
			.setTitle(msg.content)
			.setColor('#00ff45')
			.setFooter('Spork Memes v1')
			.setTimestamp(new Date())
			.setThumbnail(msg.author.avatarURL);
		return msg.channel.send(embed)
			.then(function(message) {
				message.react('⬆');
				message.react('⬇');
			}).catch(err => Logger.error(err, { tag: 'Meme Attach' }));
	}
	else if(msg.embeds) {
		// Logger.log(memeEmbed);
		embed = new RichEmbed(memeEmbed);
		return msg.channel.send(embed)
			.then(function(message) {
				message.react('⬆');
				message.react('⬇');
			}).catch(err => Logger.error(err, { tag: 'Meme Embed' }));
	}
	else if((memeAttach || memeEmbed) >= 2) {
		return msg.channel.send(msg.author.mention + ' You are posting too many attachments! (Limit 1)').then(msg => msg.delete(msgTime));
	}
	else{
		return msg.channel.send(msg.author.mention + ' You need to attach something to post in the memes channel!').then(msg => msg.delete(msgTime));
	}
};
module.exports = { createMeme };