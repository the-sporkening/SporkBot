'use strict';

const levels = require('../util/levels');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const User = require('../models').User;
const MemeManager = require('../handlers/MemeManager');

const cdSeconds = 30;
const cdSet = new Set();
const Raven = require('raven');

module.exports = class MessageManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error('Discord Client is required');
		}
	}
	async checkRole(msg, level) {
		// const roles = ['Spoon', 'Fork', 'Knife', 'Claptrap', 'True Spork'];
		const user = msg.guild.members.find(member => member.id === msg.author.id);

		if(level >= 0 && level <= 4) {
			// Level equal to or greater than 1 but less than 4
			const roleName = 'Newbie';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

			return user.addRole(role.id).catch(err => console.log(err));
		}
		else if(level >= 5 && level <= 9) {
			const roleName = 'Spoon';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
			if (user.roles.find(role => role.name.toLowerCase() === 'newbie')) {
				const oldRoleName = 'Newbie';
				const oldRole = msg.guild.roles.find(role => role.name.toLowerCase() === oldRoleName.toLowerCase());
				user.removeRole(oldRole.id);
				console.log('user has role');
			}
			return user.addRole(role.id).catch(err => console.log(err));
		}
		else if(level >= 10 && level <= 19) {
			const roleName = 'Fork';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
			if (user.roles.find(role => role.name.toLowerCase() === 'spoon')) {
				const oldRoleName = 'Spoon';
				const oldRole = msg.guild.roles.find(role => role.name.toLowerCase() === oldRoleName.toLowerCase());
				user.removeRole(oldRole.id);
				console.log('user has role');
			}
			return user.addRole(role.id).catch(err => console.log(err));
		}
		else if(level >= 20 && level <= 34) {
			const roleName = 'Knife';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
			if (user.roles.find(role => role.name.toLowerCase() === 'fork')) {
				const oldRoleName = 'Fork';
				const oldRole = msg.guild.roles.find(role => role.name.toLowerCase() === oldRoleName.toLowerCase());
				user.removeRole(oldRole.id);
				console.log('user has role');
			}
			return user.addRole(role.id).catch(err => console.log(err));
		}
		else if(level >= 35 && level <= 49) {
			const roleName = 'Claptrap';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
			if (user.roles.find(role => role.name.toLowerCase() === 'knife')) {
				const oldRoleName = 'Knife';
				const oldRole = msg.guild.roles.find(role => role.name.toLowerCase() === oldRoleName.toLowerCase());
				user.removeRole(oldRole.id);
				console.log('user has role');
			}
			return user.addRole(role.id).catch(err => console.log(err));
		}
		else if(level >= 50) {
			const roleName = 'True spork';
			const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
			if (user.roles.find(role => role.name.toLowerCase() === 'claptrap')) {
				const oldRoleName = 'Claptrap';
				const oldRole = msg.guild.roles.find(role => role.name.toLowerCase() === oldRoleName.toLowerCase());
				user.removeRole(oldRole.id);
				console.log('user has role');
			}
			return user.addRole(role.id).catch(err => console.log(err));
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
		const coinsToAdd = 0;

		const memeChannel = '545038533950308362';
		const memes = new MemeManager();
		if(msg.channel.id === memeChannel) {
			if(attachments) {
				memes.postMeme(msg).catch(err => Raven.captureException(err));
			}
			else if(msg.attachments.size > 1) {
				msg.delete().then(msg => msg.reply('One attachment at a time bro!!').then(msg => msg.delete(10000)));
			}
			else {
				msg.delete().then(msg => msg.reply('Check the pins!!!').then(msg => msg.delete(10000)));
			}
		}
		if(!cdSet.has(msg.author.id)) {
			cdSet.add(msg.author.id);
			setTimeout(() => {
				cdSet.delete(msg.author.id);
			}, cdSeconds * 1000);
			User.findOrCreate({
				where: {
					user_id: msg.author.id,
					server_id: msg.guild.id,
				},
				defaults: {
					xp: xpToAdd,
					coins: coinsToAdd,
				},
			}).spread((user, created) => {
				if(!created) {
					this.checkRole(msg, levels.getLevel(user.dataValues.xp, true)).catch(err => console.log(err));
					return user.increment('xp', { by: xpToAdd })
						.then(user => {
							const xp = user.dataValues.xp;
							const curLvl = levels.getLevel(xp - xpToAdd, true);
							const nextLvl = curLvl + 1;
							const newLvl = levels.getLevel(xp, true);
							if (newLvl === nextLvl) {
								const embed = new Discord.RichEmbed()
									.setTitle(msg.author.username + ' Leveled Up!')
									.setColor('#148d14')
									.addField('You have reached Level: ', curLvl + 1, true)
									.setThumbnail(msg.author.avatarURL);
								msg.reply(embed).then(msg => {
									msg.delete(10000);
								});
							}
						});
				}
			}).catch(err => Raven.captureException(err));
		}
	}
};