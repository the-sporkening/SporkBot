'use strict';

const Discord = require('discord.js');

module.exports = class MemeManager {
	async postMeme(msg) {
		// TODO Get attachment
		const attach = (msg.attachments);
		const receivedEmbed = attach.array()[0].proxyURL;
		if (attach) {
			const embed = new Discord.RichEmbed()
				.setImage(receivedEmbed)
				.setAuthor(msg.author.username)
				.setTitle(msg.content)
				.setColor('#00ff45')
				.setFooter('Spork Memes v1')
				.setTimestamp(new Date())
				.setThumbnail(msg.author.avatarURL);
			msg.channel.send(embed)
				.then(function(message) {
					message.react('⬆');
					message.react('⬇');
				}).catch(err => console.log(err));
		}
		msg.delete();
		// TODO Verify it is only 1 attachment
		// TODO Only get first attachment if more than 1
		// TODO Add check for youtube links
	}
	/*
	checkReactions() {
		// TODO Check for message in meme channel
	}*/
};