'use strict';

const levels = require('../util/levels');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const User = require('../models').User;
const cdSeconds = 30;
const cdSet = new Set();
module.exports = class MessageManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}
	}

	async handleMessage(msg) {
		// Don't Parse Bot Messages
		if (msg.author.bot) return false;

		// Create Helper Variables
		const text = msg.cleanContent;
		const attachments = msg.attachments.size > 0;
		if (text.length < 1 && !attachments) return false;
		const xpToAdd = levels.genXp(5, 12);

		if(!cdSet.has(msg.author.id)) {
			cdSet.add(msg.author.id);
			setTimeout(() => {
				cdSet.delete(msg.author.id);
			}, cdSeconds * 1000);
			User.findOne({
				where: {
					user_id: msg.author.id,
					server_id: msg.guild.id,
				},
			}).then(user => {
				return user.increment('xp', { by: xpToAdd });
			}).then(user => {
				const xp = user.dataValues.xp;
				const curLvl = levels.getLevel(xp - xpToAdd, true);
				const nextLvl = curLvl + 1;
				const newLvl = levels.getLevel(xp, true);
				if (newLvl === nextLvl) {
					const embed = new Discord.RichEmbed()
						.setTitle(msg.author.username + ' Leveled Up!')
						.setColor('#a100ff')
						.addField('You have reached Level: ', curLvl + 1, true)
						.setThumbnail(msg.author.avatarURL);
					msg.reply(embed).then(() => {
						msg.delete(10000);
					});
				}
			}).catch(err => console.log(err));
		}
	}
};