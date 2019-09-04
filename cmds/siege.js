// const bot = require('../bot.js');
const util = require('../util/utilities');
// const EmbedPaginator = require('eris-pagination');

const command = {
	name: 'siege',

	action: (msg, args) => {
		const platform = args[0];
		const player = args[1];
		console.log(util.searchForPlayer(platform, player));
	},

	options: {
		cooldown: 3000,
		description: 'Diplay the users Ranbox Six: Siege stats!',
		usage: 'siege',
	},
};
module.exports = command;