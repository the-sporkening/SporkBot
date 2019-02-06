const mongoose = require("mongoose");

const voiceXpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: Number,
    serverId: Number,
    timeJoined: String
});

module.exports = mongoose.model("VoiceXP", voiceXpSchema);