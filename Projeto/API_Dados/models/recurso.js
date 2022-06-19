var mongoose = require("mongoose");

var RecursoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    user: { type: String, required: true },
    data: String,
    tipo: { type: String, required: true },
    public: Boolean,
    //classificacao: String, //Ver melhor pois assim não dá para fazer média de resultados
    //nclassicacoes : Number.
    //mediaclassificacao : Number
    //comentarios: String,
    deleted: Boolean,
    deleteDate : String,
    deleteUser : String,
    path: { type: String, required: true }
});

module.exports = mongoose.model("Recurso", RecursoSchema);