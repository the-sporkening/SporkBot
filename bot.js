const SporkClient = require('./client/SporkClient');
const pjson = require('./package.json');
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

// Event Loader
const evtFiles = readSync('./events');
client.logger.log(`Loading a total of ${evtFiles.length} events.`);
evtFiles.forEach(file => {
	const eventName = file.split('.')[0];
	client.logger.log(`Loading Event: ${eventName}`);
	const event = require(`./events/${file}`);
	// Bind the client to any event, before the existing arguments
	client.on(eventName, event.bind(null, client));
});
client.logger.info(`Loaded a total of ${evtFiles.length} events.`);

client.on('disconnect', () => client.logger.warn('Connection lost...'))
	.on('reconnect', () => client.logger.info('Attempting to reconnect...'))
	.on('error', err => client.logger.error(err))
	.on('warn', info => client.logger.warn(info));
client.start();

process.on('unhandledRejection', err => {
	client.logger.error('An unhandled promise rejection occured');
	client.logger.stacktrace(err);
});