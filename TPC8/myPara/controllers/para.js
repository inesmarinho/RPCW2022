var Para = require('../models/para')

//  Lista parágrafos
module.exports.listar = function(){
    return Para
            .find()
            .exec()
}

// Insere novo parágrafos
module.exports.inserir = function(p){
    var d = new Date() // se a data não vier posso inserir
    p.data = d.toISOString().substring(0,16)
    var novo = new Para(p)
    return novo.save()
}

// Edita parágrafo

// Remove parágrafo
