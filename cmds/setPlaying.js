'use strict';
const bot = require('../bot.js');

const command = {
    name: 'setplaying',
    
    action: (msg, args) => {
        
        if (msg.author.id === '113086797872918528') {
            var playing = '';
            var text = args.slice(2).join(' ');
            var n = text.split(' | ')[1];
            text = text.split(' | ')[0];
            if (parseInt(args[1]) === 0) {
                playing = '**Playing**';
            }else if (parseInt(args[1]) === 1) {
                playing = '**Streaming**';
            }else if (parseInt(args[1]) === 2) {
                playing = '**Listening to**';
            }else if (parseInt(args[1]) === 3) {
                playing = '**Watching**';
            }
            let status = '';
            if (parseInt(args[0]) === 0) {
                status = 'online';
            }else if (parseInt(args[0]) === 1) {
                status = 'idle';
            }else if (parseInt(args[0]) === 2) {
                status = 'dnd';
            }else if (parseInt(args[0]) === 3) {
                status = 'invisible';
            }
            bot.editStatus({
                status: status,
                name: text,
                type: parseInt(args[1]),
                url: n
            });
            msg.channel.createMessage('I am now ' + playing + ' ' + text);

        }else bot.createMessage(msg.channel.id, 'You need the permission `BOT_OWNER` to use this command!')
        
    },

    options: {
        hidden: true,
        fullDescription: 'sets what the bot is playing. (Owner only command)',
        usage: '(status) (type) (URL)'
    }
}
module.exports = command;