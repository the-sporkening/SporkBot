const { readdirSync } = require('fs');
const { join } = require('path');
const bot = require('../bot.js');

function loadCommands() {

	const errorMessage = 'Something went wrong with that command.';
	const commandFiles = readdirSync(join(__dirname, 'cmds')).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const commands = require(join(__dirname, 'cmds', `${file}`));
		commands.forEach((command) => {
			const options = command.options;

			if (!options.hooks) {
				options.hooks = {};
			}

			if (!options.errorMessage) {
				options.errorMessage = errorMessage;
			}

			if (!options.cooldownMessage) {
				options.cooldownMessage = `That command has a ${(options.cooldown / 1000)} second cooldown.`;
			}

			if (!options.cooldownReturns) {
				options.cooldownReturns = 1;
			}

			if (options.argsRequired) {
				options.invalidUsageMessage = (msg) => {
					const parts = msg.content.split(' ').map(s => s.trim()).filter(s => s);
					const args = parts.slice(1);

					if (!args[0]) {
						commands.help.action(msg, command.name);
					}
				};
			}

			bot.registerCommand(command.name, command.action, options);
		});
	}
}

module.exports = loadCommands;