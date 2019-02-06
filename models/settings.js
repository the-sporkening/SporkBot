const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    serverId: Number,
    userId: String,
    xp: Number,
    coins: Number,
    lastSeen: String
});

module.exports = mongoose.model("Settings", settingsSchema);