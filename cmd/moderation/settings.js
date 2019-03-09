'use strict';

const { Command } = require('discord.js-commando');

module.exports = class SettingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setting',
			group: 'profile',
			memberName: 'profile',
			description: 'Allows you to change the server settings',
			examples: ['!set memes #memes'],
			aliases: ['profile', 'p'],
			args: [
				{
					key: 'setting',
					prompt: 'What setting',
					type: 'string',
					default: '',
				},
				{
					key: 'value',
					prompt: 'What do you want to change it to?',
					type: 'string',
					default: '',
				},
			],
			throttling: {
				usages: 2,
				duration: 30,
			},
		});
	}

/*	run(msg, { setting, value }) {
		//
		Setting.update({
			user_attributes: Sequelize.fn('JSON_SET', Sequelize.col('user_attributes'), '', ''),
		}, {
			where: {
				server_id: msg.guild.id
			},
		});
	}*/
};

/*
Setting.update({
	user_attributes: Sequelize.fn("JSON_SET", Sequelize.col('user_attributes'), "$.phone", "5554443333")
}, {
	where: {id: 7}
})*/
