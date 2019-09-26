const { Command } = require('discord-akairo');
const { RichEmbed } = require('discord.js');
class JoinmeCommand extends Command {
	constructor() {
		super('joinme', {
			aliases: ['jm'],
			category: 'fun',
			description: {
				content: 'Moves a group (up to 10) of users to your voice channel.',
				usage: '<members>',
			},
			args: [
				{
					id: 'member',
					type: 'member',
				},
			],
			channelRestriction: 'guild',
			cooldown: 5000,
			clientPermissions: ['MOVE_MEMBERS'],
			userPermissions: ['MOVE_MEMBERS'],
		});
	}

	async exec(message, args) {
		const users = message.mentions.members;
		if (message.channel.type === 'dm') {
			return message.channel.send('This command cannot be used in direct messages.');
		}
		if (!users) {
			return message.channel.send('You did not give any users!');
		}
		for(let i = 0; i < users.length; i++) {
			const member = users[i];
			this.client.logger.info(member);
			const embed = new RichEmbed()
				.setTitle('Moved Member')
				.setColor(member.displayHexColor)
				.setThumbnail(member.avatarURL)
				.setDescription(
					`**Member**: ${member.user.tag}`,
				);
			message.channel.send(embed);
		}
		// await member.move(reason).then(() => {
		// 	const embed = new RichEmbed()
		// 		.setTitle('Moved Members')
		// 		.setColor(member.displayHexColor)
		// 		.setThumbnail(member.avatarURL)
		// 		.setDescription(
		// 			`**Guild**: ${member.guild.name}\n` +
		//             '' +
		//             `**Member**: ${member.user.tag}\n` +
		//             '' +
		//             `**Reason**: ${reason}`,
		// 		)
		// 		.setFooter('Powered by Plastic');

		// 	message.channel.send(embed);

		// }).catch((err) => {
		// 	message.channel.send(`I was unable to kick member **${member.user.tag}**.`);
		// 	this.client.logger.error(err);
		// });

	}
}

module.exports = JoinmeCommand;