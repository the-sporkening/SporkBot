const { Command } = require('discord.js-commando');

module.exports = class CreateChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cc',
            group: 'moderation',
            memberName: 'cc',
            description: 'Creates a temp channel.',
            examples: ['cc'],
            args: [
                {
                    key: 'name',
                    prompt: 'What is the name of the channel?',
                    type: 'string'
                },
                {
                    key: 'type',
                    prompt: 'Type? [text | voice]',
                    type: 'string'
                }
            ]
        });
    }
    run(msg, { name, type}) {
        let server = msg.guild;
        makeChannel(server, name, type).catch(console.error);
        msg.reply("You created the " + type + " channel called " + name + "!");
        //return msg.say('Hi, I\'m awake!');
    }
};

async function makeChannel(server, name, type){
    if(!type || !name) return;
    // Create a new category channel with permission overwrites
    await server.createChannel(name, type)
        .then(console.log)
        .catch(console.error);
    await server.channels.find("name", name).setParent('535881919108218902').catch(console.error);
}