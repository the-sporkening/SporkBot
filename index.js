// TODO REBUILD SHARDING MANAGER
const { ShardingManager } = require('discord.js');
require('dotenv').config();
const path = require('path');
const Logger = require(path.join(__dirname + '/util/logger'));
const manager = new ShardingManager(path.join(__dirname + '/bot.js'), {
	token: process.env.DISCORD_TOKEN,
	shardArgs: ['--ansi', '--color', '--trace-warnings'],
	respawn: true,
});
const delay = 10 * 1000;
const timeout = 30 * 1000;
manager.spawn(this.totalShards, delay, timeout);

manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id + 1}/${manager.shards.size}`));