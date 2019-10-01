const { Listener } = require('discord-akairo');
const LavalinkServers = [{
	'name': 'sporkmusic',
	'host': 'localhost',
	'port': '2333',
	'auth': 'youshallnotpass',
}];
class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	async exec() {
	// Log that the bot is online.
		this.client.logger.info(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'ready');
		this.client.shoukaku.start(LavalinkServers, { id: this.client.user.id });
		// Set the bot status
		this.client.user.setActivity('!!!EARLY ACCESS BOT!!!', { type: 'PLAYING' });
	}
}

module.exports = ReadyListener;