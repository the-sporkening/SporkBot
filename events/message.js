const { createMeme } = require('../core/MemeManager'); 
module.exports = async (client, message) => {
	if(message.channel.name === 'memes') {
		// createMeme(message).then(message.delete(5 * 1000));
	}
};