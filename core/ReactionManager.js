'use strict';

const { CommandoClient } = require('discord.js-commando');
const Rollbar = require('rollbar');
const rollbar = new Rollbar({
	accessToken: process.env.ROLLBAR_KEY,
	captureUncaught: true,
	captureUnhandledRejections: true,
});

module.exports = class ReactionManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}
	}

	async handleReactionAdd(messageReaction, user) {
		//
		// Get the reaction from the user
		// TODO Load roles and channels from settings
		const roleName = 'Apex Legends';
		const role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

		const reaction = messageReaction.emoji.id;

		if (reaction === '544763660212633610') {
			const member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if (member) {
				//
				// Add the role
				member.addRole(role.id).catch(err => rollbar.log(err));
			}
		}
	}

	async handleReactionDel(messageReaction, user) {
		//
		// Role Name
		const roleName = 'Apex Legends';
		const role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
		//
		// Get the reaction from the user
		const reaction = messageReaction.emoji.id;
		if (reaction === '544763660212633610') {
			const member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if (member) {
				//
				// Remove the role
				member.removeRole(role.id).catch(err => rollbar.log(err));
			}
		}
	}
};