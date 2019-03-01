'use strict';

const levels = require('../util/levels');
const Discord = require('discord.js');
const joined = new Discord.Collection();
const User = require('../models').User;
const { CommandoClient } = require('discord.js-commando');
Reflect.defineProperty(joined, 'add', {
	value: async function add(id, date) {
		return joined.set(id, date);
	},
});


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
			const join = new Date().getTime();
			joined.add(newMember.user.id, join);
			// TODO Create user joined in database
		}
		else if (newUserChannel === undefined) {
			// User leaves a voice channel
			//
			const startDate = joined.get(oldMember.user.id);
			const endDate = new Date();
			const seconds = Math.round((endDate.getTime() - startDate) / 1000);
			const minutes = seconds / 60;
			const percMin = Math.round(minutes / 0.85);
			const xp = levels.genXp((minutes - percMin), minutes);
			const xpToAdd = Math.round(xp * 1.13);
			User.findOne({
				where: {
					user_id: oldMember.user.id,
					server_id: oldMember.guild.id,
				},
			}).then(user => {
				return user.increment('xp', { by: xpToAdd });
			}).catch(err => console.log(err));
			joined.delete(oldMember.user.id);
		}
	}
};