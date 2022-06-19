var Comments = require('../models/comments')
var mongoose = require("mongoose");
ObjectId = require('mongodb').ObjectId;

module.exports.inserir = comment => {
    var data = new Date()
    comment.data = data.toISOString().substring(0, 16)
    comment.deleted=false
    comment.deleteDate = ''
    comment.deleteUser = ''
    var newComment = new Comments(comment)
    return newComment.save()
}

//DONE
//fazer agregação com os users para obter o nome 
//do user e manter o seu id
module.exports.GetComment = id => {
    id = ObjectId(id)
    return Comments
        .aggregate([
            {$match : {_id:id}},
            {$lookup: {
                let: {"userId": {"$toObjectId": "$user"}}, 
                from : "users", 
                pipeline: [{"$match": {"$expr": { "$eq": [ "$_id", "$$userId"]}}}], 
                as : "utilizador"
            }},
            {$sort : {data : 1}}
        ])
        .exec()
}


//DONE
//fazer agregação com os users para obter o nome 
//do user e manter o seu id
module.exports.GetCommentsRecurso = id => {
    return Comments
        .aggregate([
            {$match : {recurso:id}},
            {$lookup: {
                let: {"userId": {"$toObjectId": "$user"}}, 
                from : "users", 
                pipeline: [{"$match": {"$expr": { "$eq": [ "$_id", "$$userId"]}}}], 
                as : "utilizador"
            }},
            {$sort : {data : 1}}
        ])
        .exec()
}


//DONE
//fazer agregação com os users para obter o nome 
//do user e manter o seu id
module.exports.GetCommentsRecursoAdmin = id => {
    if(typeof id == 'string'){
        id=ObjectId(id)
    }
    return Comments
        .aggregate([
            {$match : {recurso:id}},
            {$lookup: {
                let: {"userId": {"$toObjectId": "$user"}}, 
                from : "users", 
                pipeline: [{"$match": {"$expr": { "$eq": [ "$_id", "$$userId"]}}}], 
                as : "utilizador"
            }},
            {$lookup: {
                let: {"deleteUserId": {"$toObjectId": "$deleteUser"}}, 
                from : "users", 
                pipeline: [{"$match": {"$expr": { "$eq": [ "$_id", "$$deleteUserId"]}}}], 
                as : "deleteUsers"
            }},
            {$sort : {data : 1}}
        ])
        .exec()
}

module.exports.GetNumberOfcommentsRecurso = id => {
    return Comments
        .find({user:id})
        .count()
        .exec()
}

//fazer agregação com a collection recursos para 
//que seja ordenado pelo titulo do recurso e não 
//pela data e para não aparecer o id do recurso 
//mas sim o seu nome
//NÃO FAZER
module.exports.GetCommentsUser = id => {
    return Comments
        .find({user:id},{recurso:1, comentario:1})
        .sort({data:1})
        .exec()
}



//não se apagam dados :) apenas não os mostramos ;)
module.exports.removeComment = (id, user) =>{
    id = ObjectId(id)
    var data = new Date()
    return Comments
        .updateOne({ _id:  id},{deleted:true, deleteDate:data.toISOString().substring(0,16), deleteUser:user}); 
}

module.exports.recuperaComment = id =>{
    id = ObjectId(id)
    return Comments
        .updateOne({ _id:  id},{deleted:false, deleteDate:'', deleteUser:'aaaaaaaaaaaaaaaaaaaaaaaa'}); 
}
