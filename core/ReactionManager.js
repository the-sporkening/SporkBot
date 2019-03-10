'use strict';

const { CommandoClient } = require('discord.js-commando');
const Raven = require('raven');
// const memeChannel = '551638919377190922';
// const votes = ['⬆', '⬇'];
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
				member.addRole(role.id).catch(err => Raven.captureException(err));
			}
		}

		// ⬆ ⬇
		/* if (messageReaction.message.channel.id === memeChannel) {
			const voteName = messageReaction.emoji.name;
			// Check if the emote matches a meme reaction and user.id is valid
			if (votes.includes(voteName) && user.id !== null) {
				// Convert collection to array
				const usersArray = messageReaction.users.array();
				// console.log(usersArray);
				// Loop through array and print user if exists
				for (const userId in usersArray) {
					if(usersArray[userId].id !== null) {

						//console.log(messageReaction.message.reactions.array());
					}
					// console.log(usersArray[userId].id);
				}
			}
			// TODO Get reaction
			// TODO Check if opposite has user in it
			// TODO If true remove and add to clicked vote
		}*/
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
				member.removeRole(role.id).catch(err => Raven.captureException(err));
			}
		}
	}
};