var User = require('../models/user')
var mongoose = require("mongoose");
ObjectId = require('mongodb').ObjectId;

module.exports.getAllUsers = () => {
    return User
        .find()  //mongoose.Types.ObjectId(id)
        .exec()
}


module.exports.getUser = id => {
    return User
        .findOne({_id: id})
        .exec()
}

//Procura users que contenham o nome
module.exports.getUserByName = nome => {
    return User
        .find({username: {$regex : nome, $options: i}})
        .exec()
}

//Procura users com o livel
module.exports.getUserBylvl = lvl => {
    return User
        .find({level: lvl})
        .exec()
}

//Procura users que contenham o nome e o lvl
module.exports.getUserByNameAndlvl = (nome,lvl) => {
    return User
        .find({username: {$regex : nome, $options: i}, level: lvl})
        .exec()
}

//devolve seguidores
//Talvez fazer agregação para já obter o id, nome e pathImagem
module.exports.getFollowing = id => {
    return User
        .findOne({_id: id},{_id:0, followers:1})
        .exec()
}


module.exports.getFollowingAgr = id => {
    id = ObjectId(id)
    return User
        .aggregate([
            {$match : {_id: id}},
            {$lookup: {
                let: { "myFollowers" : "$followers" },
                from : "users", 
                pipeline: [{ "$addFields": { "stringId": { "$toString": "$_id" }}},{"$match": {"$expr": { "$in": ["$stringId" , "$$myFollowers"]}}}], 
                as : "utilizador"
            }},
            {$sort : {data : 1}}
        ])
        .exec()
}  


// Devolve uma lista "myFollowers" com os id dos users que "me" seguem
// db.users.aggregate([
//     {$match : {followers: "62ab68fea4bbfa4215977f20"}},
//     {$group: {_id : null, myFollowers: {$addToSet: "$_id"}}},
//     {$project: {_id:0, myFollowers: 1}}
// ])

// db.users.find({followers: "62ab68fea4bbfa4215977f20"}, {_id:1, username:1, level: 1})

//DONE
//preciso ir a todos os users ver se estão a dar follow no id dado
module.exports.getFollowers = id => {
    return User
        .find({followers: id}, {_id:1, username:1, level: 1})
        .exec()
}

module.exports.getFollowersListIds = id => {
    return User
        .find({followers: id}, {_id:1})
        .exec()
}



//EDITAR Users
module.exports.alterarImagem = (id,path) =>{
    return User
        .updateOne({ _id:  id},{image:path});
}

module.exports.alterarDescricao = (id,desc) =>{
    return User
        .updateOne({ _id:  id},{descricao:desc});  
}

module.exports.alterarLevel = (id,lvl) =>{
    return User
        .updateOne({ _id:  id},{level:lvl}); 
}

//adiciona um follower ao user
module.exports.addFollower = (id,follower) =>{

    return User
        .updateOne({ _id:  id},{ $addToSet: {followers: follower}}); 
}

//update fulll list of followers FAZER
module.exports.unFollower = (id,followers) =>{
    id = ObjectId(id)
    return User
        .updateOne({ _id:  id},{followers: followers}); 
}


//Remover Users
//remove remove ou manter?
module.exports.removeUser = id =>{
    return User
        .deleteOne({ _id:  id});
}