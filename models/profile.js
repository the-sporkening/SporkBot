const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    serverId: Number,
    userId: String,
    xp: Number,
    coins: Number,
    lastSeen: String
});

module.exports = mongoose.model("Profile", profileSchema);