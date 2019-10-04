const path = require('path');
const SporkClient = require(path.join(__dirname + '/client/SporkClient'));
const pjson = require(path.join(__dirname + '/package.json'));
require('dotenv').config();
const client = new SporkClient({ owner: process.env.OWNERS, token: process.env.DISCORD_TOKEN });
const Sentry = require('@sentry/node');
const { readSync } = require('readdir');
// const client.logger = require('./util/client.logger');

// Load Logger
if (process.env.SENTRY_URL) {
	try {
		client.logger.log('Sentry Monitoring Loading...');
		Sentry.init({ dsn: process.env.SENTRY_URL, environment: process.env.NODE_ENV });
		client.logger.info('Sentry Monitoring Loaded and Ready!');
	}
	catch (e) {
		client.logger.error(e);
	}
}

client.on('disconnect', () => client.logger.warn('Connection lost...'))
	.on('reconnect', () => client.logger.info('Attempting to reconnect...'))
	.on('error', err => client.logger.error(err))
	.on('warn', info => client.logger.warn(info))
	.on('raw', packet => {
		if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
		const channel = client.channels.get(packet.d.channel_id);
		if (channel.messages.has(packet.d.message_id)) return;
		channel.fetchMessage(packet.d.message_id).then(message => {
			const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
			const reaction = message.reactions.get(emoji);
			if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
			if (packet.t === 'MESSAGE_REACTION_ADD') {
				client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
			}
			if (packet.t === 'MESSAGE_REACTION_REMOVE') {
				client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
			}
		});
	});
client.start();

process.on('unhandledRejection', err => {
	client.logger.error('An unhandled promise rejection occured');
	client.logger.stacktrace(err);
});