var Classificacao = require('../models/classifications')
var mongoose = require("mongoose");

module.exports.inserir = id => {
    console.log("aqui")
    var classf = {}
    classf.classificacao = 0
    classf.numClassif = 0
    classf.usersQclassific = []
    classf.recurso = id
    var classsifcacao = new Classificacao(classf)
    console.log(classsifcacao)
    return classsifcacao.save()
}


//Obter classificacao
module.exports.getClassificacao = id => {
    return Classificacao
        .find({recurso:id},{classificacao:1})
        .exec()
}

module.exports.getClassificacaoAll = id => {
    return Classificacao
        .find({recurso:id})
        .exec()
}


//adicionar uma classificação, tenho de dar a classificação  final, o id do recurso e o user que deu a classificação
module.exports.giveClassificacao = (id,classificacao,user) => {
    return Classificacao
        .updateOne({ recurso: id}, {classificacao : classificacao, $inc: {numClassif:1 }, $addToSet: {usersQclassific: user}})
        .exec()
}