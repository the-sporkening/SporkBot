'use strict';

// const levels = require('../util/levels');
// const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
module.exports = class MessageManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}
	}

	async handleVoiceUpdate(oldMember, newMember) {

		const newUserChannel = newMember.voiceChannel;
		const oldUserChannel = oldMember.voiceChannel;

		if (oldUserChannel === undefined && newUserChannel !== undefined) {
			//
			// Add Xp for being in a voice channel
			// const join = new Date();
			// TODO Create user joined in database
		}
		else if (newUserChannel === undefined) {
			// User leaves a voice channel
			//
			// TODO Calculate time to xp gained
			/*
					const startDate = voicexp.timeJoined;
					const endDate = new Date();
					const seconds = Math.round((endDate.getTime() - startDate) / 1000);
					const minutes = seconds / 60;
					const percMin = Math.round(minutes / 0.85);
					const xp = levels.genXp((minutes - percMin), minutes);
					const xpToAdd = Math.round(xp * 1.13);
			*/
			// TODO Add xp to db
			// TODO Add Level up message
		}
	}
};