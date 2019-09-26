const LavalinkServers = [{
	'name': 'sporkmusic',
	'host': 'localhost',
	'port': '2333',
	'auth': 'youshallnotpass',
}];
module.exports = async client => {
	// Log that the bot is online.
	client.logger.info(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'ready');
	client.shoukaku.start(LavalinkServers, { id: client.user.id });
	// Set the bot status
	client.user.setActivity('!!!EARLY ACCESS BOT!!!', { type: 'PLAYING' });
};