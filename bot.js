const Eris = require('eris');
require('dotenv').config();
const botOptions = { defaultImageSize: 512 };

const commandOptions = {
  prefix: ['s!'],
  defaultHelpCommand: true,
};

const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, botOptions, commandOptions);

module.exports = bot;