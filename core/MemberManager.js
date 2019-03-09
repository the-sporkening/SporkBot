'use strict';

const { CommandoClient } = require('discord.js-commando');
const User = require('../models').User;
const Raven = require('raven');
module.exports = class MemberManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}

	}

	async joinServer(member) {
		User.findOrCreate({ where: { user_id: member.id, server_id: member.guild.id } })
			.catch(err => Raven.captureException(err));
		// member.message(this.welcomeMessage(member));
	}
	// async welcomeMessage() {
	/*		// Define default settings

		// First, get the welcome message using get:
		let welcomeMessage = 'Welcome {{user}} to the Sporkening!!';

		// Replace placeholder in message
		welcomeMessage = welcomeMessage.replace('{{user}}', member.user.tag);

		const embed = new Discord.RichEmbed()
			.setTitle(welcomeMessage)
			.setDescription('Show them some love :D')
			.setThumbnail(member.avatarURL)
			.setColor('#103bff');
		// we'll send to the welcome channel.
		member.guild.channels
			.find('name', this.client.settings.get(member.guild.id, 'welcomeChannel'))
			.send(embed)
			.catch();*/
	// }
};