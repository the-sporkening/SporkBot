// TODO REBUILD SHARDING MANAGER
const { ShardingManager } = require('discord.js');
require('dotenv').config();
const Logger = require('./util/Logger');
const manager = new ShardingManager('./bot.js', {
	token: process.env.DISCORD_TOKEN,
	shardArgs: ['--ansi', '--color', '--trace-warnings'],
	autoSpawn: true,
});

manager.spawn();

manager.on('launch', shard => Logger.info(`Launched shard ${shard.id + 1}/${manager.shards.size}`));
