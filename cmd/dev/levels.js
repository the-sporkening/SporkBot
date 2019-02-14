const Discord = require("discord.js");
const {Command} = require('discord.js-commando');
const Levels = require("../../models/levels");
const level = require("../../util/levels.js");
const mongoose = require("mongoose");
module.exports = class LevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'levels',
            group: 'dev',
            memberName: 'levels',
            description: 'levels',
            examples: ['levels'],
            aliases: ['levels'],
        });
    }

    run(msg) {
        for (let i = 0; level.getLevel(i) <= 50; i++) {
            //console.log("Level: " + calcLevel(i) + ", XP: " + i);
            //Returns multiples of x + 1
            let levelCalc = (level.getLevel(i) % 1);
            if (levelCalc === 0) {
                let x = 0;
                console.log(i);
                Levels.findOne({
                    level: x,
                    xp: i
                }, (err, levels) => {
                    if (err) console.log(err);
                    console.log("success");
                    if (!levels) {
                        const newLevel = new Levels({
                            _id: mongoose.Types.ObjectId(),
                            level: levelCalc,
                            xp: i
                        });
                        newLevel.save().catch(err => console.log(err));
                    } else {

                    }
                });
                x++;
            }
        }
    }
};