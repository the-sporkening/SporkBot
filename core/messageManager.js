// Main Requires
require('dotenv').config();
// const log = require('../util/logger');
// const bot = require('../bot');

const handleMessage = function(msg) {
	if (msg.author.bot) return false;
	if(msg.channel.name === 'memes') {
		msg.delete();
		memeMessage(msg);
	}
};

const memeMessage = function(msg) {
	const attLength = msg.attachments.length;
	const attachments = attLength > 0 && attLength < 2;
	const msgTime = 5 * 1000;
	if(attachments) {
		const memeEmbed = {
			embed: {
				title: msg.content,
				author: {
					name: msg.author.username,
					url: 'https://getsporked.lol',
					icon_url: msg.author.avatarURL,
				},
				image: {
					url: msg.attachments[0].proxy_url,
				},
				footer: {
					icon_url: msg.author.avatarURL,
					text: 'SporkMemes v2',
				},
				timestamp: new Date(),
			},
		};
		//   derp.addReaction('⬆');
		//   derp.addReaction('⬇');
		return msg.channel.createMessage(memeEmbed);
	}
	else if(attLength > 2) {
		return msg.channel.createMessage(msg.author.mention + ' You are posting too many attachments! (Limit 1)').then(msg => msg.delete(msgTime));
	}
	else{
		msg.channel.createMessage(msg.author.mention + ' You need to attach something to post in the memes channel!').then(msg => msg.delete(msgTime));
	}
};

module.exports = {
	handleMessage: handleMessage,
};