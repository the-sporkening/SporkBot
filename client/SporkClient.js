const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
// const { Collection } = require('discord.js');
const Database = require('./Database');
const path = require('path');
const SettingsProvider = require('../client/SettingsProvider');
const Setting = require('../models/settings');
const Logger = require('../util/Logger');
require('dotenv').config();
class SporkClient extends AkairoClient {
	constructor(config) {
		super({
			ownerID: config.owner,
			disabledEvents: ['TYPING_START'],
			commandUtilLifetime: 600000,
		});
		this.config = config;
		this.logger = Logger;
		this.commandHandler = new CommandHandler(this, {
			directory: './commands',
			aliasReplacement: /-/g,
			prefix: message => this.settings.get(message.guild, 'prefix', 's!'),
			allowMention: true,
			fetchMembers: true,
			commandUtil: true,
			commandUtilLifetime: 3e5,
			commandUtilSweepInterval: 9e5,
			handleEdits: true,
			defaultCooldown: 2500,
			argumentDefaults: {
				prompt: {
					modifyStart: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
					modifyRetry: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
					timeout: msg => `${msg.author} **::** Time ran out, command has been cancelled.`,
					ended: msg => `${msg.author} **::** Too many retries, command has been cancelled.`,
					cancel: msg => `${msg.author} **::** Command has been cancelled.`,
					retries: 4,
					time: 30000,
				},
			},
		});
		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, '../listeners'),
		});
		this.settings = new SettingsProvider(Setting);
		this.setup();
	}
	setup() {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	async start() {
		await Database.authenticate();
		await this.settings.init();
		return this.login(this.config.token);
	}
}

module.exports = SporkClient;