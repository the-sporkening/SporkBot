const axios = require('axios');
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_ID;
const Discord = require('discord.js');
module.exports = class createvoice {
    constructor(){
        this.name = 'Twitch Top',
            this.alias = ['tt'],
            this.usage = '?tt'
    }
    run(bot, msg, args){
        let server = msg.guild;
        axios.get('https://api.twitch.tv/helix/streams?type=live&first=' + args[1] + '&language=en')
            .then(function (response) {
                let datas = response.data.data;
                console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    let list = datas[i];
                    let thumb = list.thumbnail_url;
                    let prettyt = sizeImage(thumb, {
                        width: 900,
                        height: 500
                    });
                    //console.log(thumb);
                    let embed = new Discord.RichEmbed()
                        .setTitle(getUser(thumb))
                        .setURL("https://www.twitch.tv/" + getUser(thumb))
                        .setColor("PURPLE")
                        .setDescription(list.title)
                        .addField("Viewers: " + list.viewer_count)
                        .setImage(prettyt).setURL("https://www.twitch.tv/" + getUser(thumb));
                    msg.channel.send(embed);
/*                    msg.channel.send(
                        "\n" +
                        getUser(thumb) + "\n" +
                        /!*"https://www.twitch.tv/" + getUser(thumb) + "\n" +*!/
                        "Title: " + list.title + "\n" +
                        "Viewers: " + list.viewer_count + "\n" +
                        prettyt
                    );*/
                }
            }).catch((error) => {
            console.log(error);
        });

    }
}
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