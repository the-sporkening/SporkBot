'use strict';

require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const debug = process.env.DEBUG;
const client = new CommandoClient({
	commandPrefix: process.env.PREFIX,
	unknownCommandResponse: false,
	owner: '113086797872918528',
	disableEveryone: true,
});
/*
* Event Managers
*/
const MessageManager = require('./core/MessageManager');
const VoiceManager = require('./core/VoiceManager');
const ReactionManager = require('./core/ReactionManager');
const MemberManager = require('./core/MemberManager');
/*
* Event Handlers
*/
const MsgEvent = new MessageManager(client);
const VoiceEvent = new VoiceManager(client);
const ReactionEvent = new ReactionManager(client);
const MemberEvent = new MemberManager(client);

//
// Registers things
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['profile', ':candy:Profile Commands:candy:'],
		['moderation', ':pencil2:Moderation Commands:pencil2:'],
		['fun', ':candy:Fun Commands:candy:'],
	])
	.registerCommandsIn(path.join(__dirname, 'cmd'));
// Checks to see if the bot is ready
client.on('ready', () => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'your every word',
			url: 'https://www.twitch.tv/snipey92',
			type: 'LISTENING',
		},
	}).catch(console.error);
	//
	// Title
	if (!debug) {
		console.log('\n' +
      '  ___               _   ___      _    __   ___ \n' +
      ' / __|_ __  ___ _ _| |_| _ ) ___| |_  \\ \\ / / |\n' +
      ' \\__ \\ \'_ \\/ _ \\ \'_| / / _ \\/ _ \\  _|  \\ V /| |\n' +
      ' |___/ .__/\\___/_| |_\\_\\___/\\___/\\__|   \\_/ |_|\n' +
      '     |_|                                       \n');
		console.log('=======================================================================');
	}
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => MsgEvent.handleMessage(message));
client.on('guildMemberAdd', member => MemberEvent.joinServer(member));
client.on('voiceStateUpdate', (oldMember, newMember) => VoiceEvent.handleVoiceUpdate(oldMember, newMember));
client.on('messageReactionAdd', (messageReaction, user) => ReactionEvent.handleReactionAdd(messageReaction, user));
client.on('messageReactionRemove', (messageReaction, user) => ReactionEvent.handleReactionDel(messageReaction, user));

client.on('raw', (event) => {
	const eventName = event.t;
	if (eventName === 'MESSAGE_REACTION_ADD') {
		if (event.d.message_id === '544764878632779789') {
			const reactionChannel = client.channels.get(event.d.channel_id);
			if (!reactionChannel.messages.has(event.d.message_id)) {
				reactionChannel.fetchMessage(event.d.message_id)
					.then(msg => {
						const msgReaction = msg.reactions.get(event.d.emoji.name + ':' + event.d.emoji.id);
						const user = client.users.get(event.d.user_id);
						client.emit('messageReactionAdd', msgReaction, user);
					})
					.catch(err => console.log(err));
			}
		}
	}
});
client.login(process.env.DISCORD_TOKEN).catch();
