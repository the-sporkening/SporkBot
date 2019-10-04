// Discord Stuff
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
// Import the database settings
const Database = require('../client/Database');
// Providers
const SettingsProvider = require('../client/providers/SettingsProvider');
const ModulesProvider = require('../client/providers/ModulesProvider');
// Models
const Setting = require('../models/settings');
const Module = require('../models/modules');
// Logger
const Logger = require('../util/logger');
// Lavalink wrapper
const { Shoukaku } = require('shoukaku');
// Music Queue
const Queue = require('../modules/Queue');
// Node Modules
const path = require('path');
require('dotenv').config();

class SporkClient extends AkairoClient {
	constructor(config) {
		super({
			ownerID: '113086797872918528',
			disabledEvents: ['TYPING_START'],
			commandUtilLifetime: 600000,
		});
		// Init config
		this.config = config;
		// Init Logger
		this.logger = Logger;
		// Init Command Handler
		this.commandHandler = new CommandHandler(this, {
			directory: './commands',
			aliasReplacement: /-/g,
			prefix: message => this.settings.get(message.guild, 'prefix', ';'),
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
		// Init Listener Handler
		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, '../listeners'),
		});
		// Init Inhibitor Handler
		// this.inhibitorHandler = new InhibitorHandler(this, {
		// 	directory: path.join(__dirname, '../inhibitors'),
		// });
		// Init Setting
		this.settings = new SettingsProvider(Setting);
		// Init Modules
		this.modules = new ModulesProvider(Module);
		// Init client embed
		this.embed = MessageEmbed;
		// Run setup
		this.setup();
	}

	// Setup all our handlers/listeners/inhibitors
	setup() {
		// this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			// inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
		});
		// Load all handlers
		this.commandHandler.loadAll();
		// this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		// Init Lavalink wrapper
		this.shoukaku = new Shoukaku(this, {
			resumable: 'resumable-spork',
			resumableTimeout: 30,
			reconnectTries: 2,
			restTimeout: 10000,
		});
		// Init Queue
		this.queue = new Queue(this);

		this.shoukaku.on('ready', (name, resumed) => this.logger.info(`Lavalink Node: ${name} is now connected. This connection is ${resumed ? 'resumed' : 'a new connection'}`))
			.on('error', (name, error) => this.logger.error(`Lavalink Node: ${name} emitted an error.`, error))
			.on('close', (name, code, reason) => this.logger.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`))
			.on('disconnected', (name, reason) => this.logger.warn(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`));
		// this.listenerHandler.on('load', (listener, reload) => reload ? this.logger.log(`Loaded ${listener.event}`) : this.logger.log(`Reloaded ${listener.event}`));
	}
	// Start The Bot
	async start() {
		await Database.authenticate();
		await this.settings.init();
		return this.login(this.config.token);
	}
}

module.exports = SporkClient;