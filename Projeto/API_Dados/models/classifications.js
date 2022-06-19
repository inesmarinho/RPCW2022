var mongoose = require("mongoose");

var CassificationSchema = new mongoose.Schema({
    classificacao: Number, //estrelas 0/5
    numClassif: Number,  //# de useres que classificou
    usersQclassific: [], //lista de users que já classificou 
    recurso: String        //o recurso
});

module.exports = mongoose.model("Classifications", CassificationSchema);