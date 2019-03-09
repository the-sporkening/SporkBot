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
const RawManager = require('./core/RawManager');
/*
* Event Handlers
*/
const MsgEvent = new MessageManager(client);
const VoiceEvent = new VoiceManager(client);
const ReactionEvent = new ReactionManager(client);
const MemberEvent = new MemberManager(client);
const RawEvent = new RawManager(client);
/*
* Custom event handlers
*/
const SettingsManager = require('./handlers/SettingsManager');
const settings = new SettingsManager(client);
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
	for(const guild in client.guilds) {
		settings.defaultSettings(guild);
	}
	const text = ['!help', 'https://getsporked.lol', 'See #info for details'];
	setInterval(() => {
		const shuffle = Math.floor(Math.random() * text.length);
		let selection = text[shuffle];
		if (selection == null) selection = text[shuffle];
		client.user.setPresence({
			status: 'online',
			game: {
				name: `${selection}`,
				type: 'STREAMING',
			},
		});
	}, 5 * 60 * 1000);
	client.user.setPresence({
		game: {
			name: text[0],
			type: 'STREAMING',
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
})
	.on('error', err => console.error(err))
	.on('warn', err => console.warn(err))
	.on('message', message => MsgEvent.handleMessage(message))
	.on('guildMemberAdd', member => MemberEvent.joinServer(member))
	.on('voiceStateUpdate', (oldMember, newMember) => VoiceEvent.handleVoiceUpdate(oldMember, newMember))
	.on('messageReactionAdd', (messageReaction, user) => ReactionEvent.handleReactionAdd(messageReaction, user))
	.on('messageReactionRemove', (messageReaction, user) => ReactionEvent.handleReactionDel(messageReaction, user))
	.on('raw', (event) => RawEvent.handleRawEvent(event));
client.login(process.env.DISCORD_TOKEN).catch(err => console.error(err));
