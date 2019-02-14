const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    level: String,
    xp: Number
});


module.exports = mongoose.model("Levels", levelSchema);