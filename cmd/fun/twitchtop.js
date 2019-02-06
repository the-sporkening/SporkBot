const { Command } = require('discord.js-commando');

const Discord = require('discord.js');
module.exports = class TwitchTopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tt',
            group: 'fun',
            memberName: 'tt',
            description: 'Gets [amount] of twitch top streamers',
            examples: ['tt'],
            args: [{
                key: 'amount',
                prompt: 'how many?',
                type: 'integer'
            }],
        });
    }
    run(msg, { amount}) {
        if(amount > 6) return;
        const axios = require('axios');
        axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_ID;
        axios.get('https://api.twitch.tv/helix/streams?type=live&first=' + amount + '&language=en')
            .then(function (response) {
                let datas = response.data.data;
                //console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    let list = datas[i];
                    let thumb = list.thumbnail_url;
                    let prettyt = sizeImage(thumb, {
                        width: 900,
                        height: 500
                    });
                    let embed = new Discord.RichEmbed()
                        .setTitle(getUser(thumb))
                        .setURL("https://www.twitch.tv/" + getUser(thumb))
                        .setColor("PURPLE")
                        .setDescription(list.title)
                        .addField("Viewers: " + list.viewer_count)
                        .setImage(prettyt).setURL("https://www.twitch.tv/" + getUser(thumb));
                    msg.channel.send(embed);
                }
            }).catch((error) => {
            console.log(error);
        });
    }
};
const getUser = (url) => {
    const urlsplit = url.split("/");
    const trail = urlsplit[4];
    const username_split = trail.replace("live_user_", "").split("-");
    return username_split[0];
};
const sizeImage = (url, {width, height}) => {
    const base_url = "https://static-cdn.jtvnw.net/previews-ttv";
    const urlsplit = url.split("/");
    const trail = urlsplit[4];
    const username_split = trail.split("-");
    const user_name = username_split[0];
    const base_img_ext = ".jpg";
    return `${base_url}/${user_name}-${width}x${height}${base_img_ext}`;

};