var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    level: String,
    image: String,
    descricao: String,
    followers : [String]
});

module.exports = mongoose.model("User", UserSchema);