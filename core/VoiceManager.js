'use strict';

const Profile = require('../models/profile');
const levels = require('../util/levels');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
module.exports = class MessageManager {

	constructor(client) {
		this.client = client;

		if (!this.client || !(this.client instanceof CommandoClient)) {
			throw new Error("Discord Client is required");
		}
	}

	async handleVoiceUpdate(oldMember, newMember) {

		let newUserChannel = newMember.voiceChannel;
		let oldUserChannel = oldMember.voiceChannel;

		if (oldUserChannel === undefined && newUserChannel !== undefined) {
			//
			// Add Xp for being in a voice channel
			const join = new Date();
			VoiceXP.findOne({
				userId: newMember.user.id,
				serverId: newUserChannel.guild.id
			}, (err, voicexp) => {
				if (err) console.log(err);
				if (!voicexp) {
					const newVoiceXp = new VoiceXP({
						_id: mongoose.Types.ObjectId(),
						userId: newMember.user.id,
						serverId: newMember.guild.id,
						timeJoined: join
					});
					newVoiceXp.save().catch(err => console.log(err));
				} else {
					//
					// msg.reply("VoiceXP exists already!");
				}
			});
		} else if (newUserChannel === undefined) {
			// User leaves a voice channel
			//
			// let xpGained;
			let finalXpAdd = 0;
			VoiceXP.findOne({
				userId: oldMember.user.id,
				serverId: oldUserChannel.guild.id
			}, (err, voicexp) => {
				if (err) console.log(err);
				if (voicexp) {
					const startDate = voicexp.timeJoined;
					const endDate = new Date();
					const seconds = Math.round((endDate.getTime() - startDate) / 1000);
					const minutes = seconds / 60;
					const percMin = Math.round(minutes / 0.85);
					const xp = levels.genXp((minutes - percMin), minutes);
					const xpToAdd = Math.round(xp * 1.13);
					finalXpAdd = xpToAdd;
					voicexp.remove(function(err) {
						if (err) throw err;
						console.log('User successfully deleted!');
					});
				}
			});
			Profile.findOne({
				userId: oldMember.user.id,
				serverId: oldUserChannel.guild.id
			}, (err, profile) => {
				if (err) console.log(err);
				if (!profile) {
					//
					// If not exist
					console.log('User not in channel!');
				} else {
					const curLvl = levels.getLevel(profile.xp, true);
					const nextLvl = curLvl + 1;
					profile.xp = profile.xp + finalXpAdd;
					profile.save().catch(err => console.log(err));
					const newLvl = levels.getLevel(profile.xp, true);
					//
					// If the new level equals the next level send message that the user leveled up
					if (newLvl === nextLvl) {
						const embed = new Discord.RichEmbed()
							.setTitle(oldMember.user.username + ' Leveled Up!')
							.setColor('#a100ff')
							.addField('You have reached Level: ', curLvl + 1, true)
							.setThumbnail(msg.author.avatarURL);
						oldMember.message.reply(embed).then(msg => {
							msg.delete(10000);
						});
					}
				}
			});
		}
	}
};