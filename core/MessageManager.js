'use strict';

const Profile = require('../models/profile');
const levels = require('../util/levels');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const cdSeconds = 15;
const cdSet = new Set();
module.exports = class MessageManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error("Discord Client is required");
		}
	}

	async handleMessage(msg) {
		// Don't Parse Bot Messages
		if (msg.author.bot) return false;

		// Create Helper Variables
		let text = msg.cleanContent;
		const channel = msg.channel;
		const server = msg.guild ? msg.guild.name : "DM";
		const user = msg.author;
		const attachments = msg.attachments.size > 0;
		//this.giveCoins(user);
		if (text.length < 1 && !attachments) return false;

		// Set Variables
		msg.context = this;
		user.nickname = msg.member ? msg.member.displayName : msg.author.username;
		// Run Command
		//return this.runCommand(command, message, channel, user, args);
		const xpToAdd = levels.genXp(5, 12);
		Profile.findOne({
			userId: msg.author.id,
			serverId: msg.guild.id,
		}, (err, profile) => {
			if (err) console.log(err);
			if (!profile) {
				const newProfile = new Profile({
					_id: mongoose.Types.ObjectId(),
					userId: msg.author.id,
					serverId: msg.guild.id,
					xp: xpToAdd,
				});
				newProfile.save().catch(err => console.log(err));
				cdSet.add(msg.author.id);
				setTimeout(() => {
					cdSet.delete(msg.author.id);
					console.log('Cooldown expired for ' + msg.author.id);
				}, cdSeconds * 1000);
				console.log((cdSet));
			} else {
				if (!cdSet.has(msg.author.id)) {
					const curLvl = levels.getLevel(profile.xp, true);
					const nextLvl = curLvl + 1;
					profile.xp = profile.xp + xpToAdd;
					profile.save().catch(err => console.log(err));
					const newLvl = levels.getLevel(profile.xp, true);
					cdSet.add(msg.author.id);
					setTimeout(() => {
						cdSet.delete(msg.author.id);
					}, cdSeconds * 1000);
					//
					// If the new level equals the next level send message that the user leveled up
					if (newLvl === nextLvl) {
						const embed = new Discord.RichEmbed()
							.setTitle(msg.author.username + ' Leveled Up!')
							.setColor('#a100ff')
							.addField('You have reached Level: ', curLvl + 1, true)
							.setThumbnail(msg.author.avatarURL);
						msg.reply(embed).then(msg => {
							msg.delete(10000);
						});
					}
				}
			}
		});
	}
};