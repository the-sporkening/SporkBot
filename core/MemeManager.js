// const { RichEmbed } = require('discord.js');
// const Logger = require('../util/Logger');
const createMeme = function(msg) {

	// TODO Bot Checks If Module Enabled
	// TODO User posts meme
	// TODO Bot adds meme to db
	// TODO Bot reacts with emoji
	// TODO If user already reacted add to other
	// TODO Detect reports
	// TODO Delete Meme if reported
	// TODO If meme reaches featured pin to channel
	// TODO ADD/REMOVE Karma
	// TODO Check if user exists in UP/DOWN vote

	msg.react('⬆')
		.then(() => msg.react('⬇'))
		.then(() => msg.react('⚠'))
		.catch(() => console.error('One of the emojis failed to react.'));
	// msg.react('⬆');
	// msg.react('⬇');
	// msg.react('⚠');
};
module.exports = { createMeme };