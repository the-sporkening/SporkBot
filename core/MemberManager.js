'use strict';

const { CommandoClient } = require('discord.js-commando');
const User = require('../models').User;
const Discord = require('discord.js');
module.exports = class MemberManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}
	}

	async joinServer(member) {
		User.findOrCreate({ where: { user_id: member.id, server_id: member.guild.id } })
			.catch(err => text(err));
		// member.message(this.welcomeMessage(member));
	}
	async welcomeMessage(member) {
		return new Discord.RichEmbed()
			.setTitle(member.username + ' Joined the server!')
			.setThumbnail(member.avatarURL)
			.setColor('#103bff');
	}
};