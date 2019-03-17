'use strict';
const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const User = require('../../models').User;
const level = require('../../util/levels.js');
const Raven = require('raven');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top',
			group: 'profile',
			memberName: 'top',
			description: 'Displays the top users',
			examples: ['top, t'],
			aliases: ['top', 't'],
			throttling: {
				usages: 1,
				duration: 30,
			},
		});
	}

	run(msg) {
		User.findAll({
			where: {
				server_id: msg.guild.id,
				xp: {
					[Op.gt]: 0,
				},
			},
			limit: 6,
			order: [
				// Will escape title and validate DESC against a list of valid direction parameters
				['xp', 'DESC'],
			],
		}).then(result => {
			const embed = new Discord.RichEmbed();
			embed.setColor('#ffda09');
			embed.setDescription('Top 6 Leaders');
			let count = 1;
			result.forEach(
				(user) => {
					embed.addField('# ' + count, '<@' + user.dataValues.user_id + '>', true);
					embed.addField('Xp', user.dataValues.xp, true);
					embed.addField('Level', level.getLevel(user.dataValues.xp, true), true);
					count++;
				},
			);
			msg.reply(embed).then(msg => msg.delete(10 * 1000)).catch(err => Raven.captureException(err));
		});
		msg.delete(10 * 1000);
	}
};
