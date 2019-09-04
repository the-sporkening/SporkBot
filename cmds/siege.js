// const bot = require('../bot.js');
const util = require('../util/utilities');
const EmbedPaginator = require('eris-pagination');

const command = {
	name: 'siege',

	action: (msg, args) => {
		const platform = args[0];
		const player = args[1];
		const response = util.searchForPlayer(platform, player);
		// const userEmbeds = [];
		
		if(response.results.length === 1){
			console.log(response.results.p_id)
		} else {
			EmbedPaginator.createPaginationEmbed(
				msg, 
				myEmbeds, 
				{
					showPageNumbers: true,
					extendedButtons: true,
					timeout: 300000,
					backButton: '◀',
					forthButton: '▶',
					selectButton: '💩',
					deleteButton: '❌',
				}
			);
		}
    }
		// const data = {
		// 	"embed": {
		// 	  "title": "Rainbow Six Siege Stats",
		// 	  "url": "https://discordapp.com",
		// 	  "color": 4395651,
		// 	  "timestamp": "2019-09-04T06:27:06.107Z",
		// 	  "footer": {
		// 		"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
		// 		"text": "Fueled with ⚡ by Snipey#0001"
		// 	  },
		// 	  "thumbnail": {
		// 		"url": "https://cdn.discordapp.com/embed/avatars/3.png"
		// 	  },
		// 	  "image": {
		// 		"url": "https://cdn.discordapp.com/embed/avatars/0.png"
		// 	  },
		// 	  "author": {
		// 		"name": "PLAYER_NAME",
		// 		"url": "https://discordapp.com",
		// 		"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
		// 	  },
		// 	  "fields": [
		// 		{
		// 		  "name": "😱",
		// 		  "value": "```try exceeding some of them!```"
		// 		}
		// 	  ]
		// 	}
		//   };

		// return msg.channel.createMessage(args[0] + args[1]);
	},

	options: {
		cooldown: 1000,
		description: 'Diplay the users Ranbox Six: Siege stats!',
		usage: 'siege',
	},
};
module.exports = command;