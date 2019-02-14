const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userId: Number,
    serverId: Number,
    xp: Number,
    coins: Number,
    lastSeen: Date
});


module.exports = mongoose.model("Profile", profileSchema);