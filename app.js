'use strict';

// Main Requires
require('dotenv').config();
const log = require('./util/logger');
const bot = require('./bot.js');
// Load Commands
const loadCommands = require('./util/command_loader.js');
// Managers
const messageManager = require('./core/messageManager');
const voiceManager = require('./core/voiceManager');


bot.on('ready', () => {
	log.warn('Initializing SporkBOT...');
	bot.editStatus({
		status: 'online',
		name: 'https://getsporked.lol',
		type: 3,
	});
	log.warn('Loading commands...');
	loadCommands();
	log.success('Commands Loaded!');
	log.success('Logged in as SporkBOT!');
})
// Error Handlers
	.on('error', err => log.error(err))
	.on('warn', err => log.warn(err))
// Message Handling
	.on('messageCreate', message => messageManager.handleMessage(message))
// Member Join Functions
// .on('guildMemberAdd', (guild, member) => serverManager.joinServer(guild, member))
// Voice xp updates
// .on('voiceStateUpdate', (oldMember, newMember) => voiceManager.handleVoiceUpdate(oldMember, newMember))
	.on('voiceChannelJoin', (member, newChannel) => voiceManager.handleChannelJoin(member, newChannel))
	.on('voiceChannelLeave', (member, oldChannel) => voiceManager.handleChannelLeave(member, oldChannel))
	.on('voiceChannelSwitch', (member, newChannel, oldChannel) => voiceManager.handleChannelSwitch(member, newChannel, oldChannel));
// Reaction Handlers
// .on('messageReactionAdd', (messageReaction, user) => reactionManager.handleReactionAdd(messageReaction, user))
// .on('messageReactionRemove', (messageReaction, user) => reactionManager.handleReactionDel(messageReaction, user))

bot.connect();