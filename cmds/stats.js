const bot = require('../bot.js');

const command = {
  name: 'stats',

  action: (msg) => {


    let totalSeconds = process.uptime();

    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `\`${days} days, ${hours} hrs, ${minutes} min, ${seconds} sec\``;
    const statsEmbed = {
      embed: {
        title: 'About SporkBOT',
        color: 6068849,
        description: 'An spork-themed discord bot.',
        thumbnail: {
          url: bot.user.avatarURL,
        },
        fields: [
          {
            name: 'Uptime',
            value: uptime,
            inline: true,
          },
        ],
      },
    };

    return msg.channel.createMessage(statsEmbed);
  },

  options: {
    cooldown: 1000,
    description: 'Diplay the stats message!',
    usage: 'stats',
  },
};

module.exports = command;