'use strict';

const { CommandoClient } = require('discord.js-commando');


module.exports = class SettingsManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}

	}

	/*	async defaultSettings(guild) {
		//
	}*/
/*	async loadSettings(guild) {
		//
		const config = [];
		return config;
	}
	async saveSettings(guild, settings) {
		this.defaultSettings(guild).catch(err => (err));
		// return this.client.settings.set(settings).catch(err => (err));
	}*/
};