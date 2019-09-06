const { AkairoClient } = require('discord-akairo');
// const { Collection } = require('discord.js');
const Database = require('./Database');
const path = require('path');
// const SettingsProvider = require('./SettingsProviders');
// const Setting = require('../models/settings');
const Logger = require('../util/Logger');
require('dotenv').config();
class SporkClient extends AkairoClient {
	constructor(config) {
		super({
			ownerID: config.owner,
			listenerDirectory: './listeners/',
			commandDirectory: path.join(__dirname, '..', 'commands'),
			disabledEvents: ['TYPING_START'],
		});
		this.config = config;
		this.logger = Logger;
	}

	async start() {
		await Database.authenticate();
		// await this.settings.init();
		return this.login(this.config.token);
	}
}

module.exports = SporkClient;