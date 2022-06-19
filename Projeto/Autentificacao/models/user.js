var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    email: {type: String, unique:true, required: 'Please enter your email', trim: true, lowercase:true},
    level: { type: String, required: true },
    image: String, //parece desnecessário pode ser usado no api-dados
    descrição: String, //parece desnecessário pode ser usado no api-dados
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);