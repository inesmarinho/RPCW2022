var express = require('express');
var router = express.Router();
const Comments = require('../controllers/comments')
const Recurso = require('../controllers/recurso')
const User = require('../controllers/user');
const user = require('../models/user');

//Get all users
router.get('/', function (req, res) {
    console.log(req.query)
    if (req.query['lvl'] != undefined && req.query['nome'] != undefined) { //com filtro para o nome e lvl
        User.getUserByNameAndlvl(req.query['nome'], req.query['lvl'])
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(501).jsonp({ error: e }))
    } else
        if (req.query['lvl'] != undefined) { //com filtro para lvl
            User.getUserBylvl(req.query['lvl'])
                .then(dados => res.status(200).jsonp(dados))
                .catch(e => res.status(501).jsonp({ error: e }))
        } else
            if (req.query['nome'] != undefined) { //com filtro para nome
                User.getUserByName(req.query['nome'])
                    .then(dados => res.status(200).jsonp(dados))
                    .catch(e => res.status(501).jsonp({ error: e }))
            } else
                User.getAllUsers()
                    .then(dados => res.status(200).jsonp(dados))
                    .catch(e => res.status(501).jsonp({ error: e }))
});


//recebo o id de quem é para alterar a descrição, se o id for igual ao do user a tentar alterar 
//pode ou então apenas o admin pode
router.post('/atualizaDescricao/:id', function (req, res) {
    console.log(req.body.descricao)
    console.log(req.params.id)
    User.getUser(req.params.id)
        .then(dados => {
            if (dados._id == req.params.id || req.user.level == 'admin') {
                User.alterarDescricao(req.params.id, req.body.descricao)
                    .then(dadosRec => res.status(200).jsonp(dadosRec))
                    .catch(e => res.status(501).jsonp({ error: e }))
            }
        })
        .catch(e => res.status(501).jsonp({ error: e }))

});

//recebo o id de quem é para alterar o path da imagem, se o id for igual ao do user a tentar alterar 
//pode ou então apenas o admin pode
router.post('/atualizaImagem/:id', function (req, res) {
    console.log(req.body.pathImage)
    console.log(req.params.id)
    User.getUser(req.params.id)
        .then(dados => {
            if (dados._id == req.params.id || req.user.level == 'admin') {
                User.alterarImagem(req.params.id, req.body.pathImage)
                    .then(dadosRec => res.status(200).jsonp(dadosRec))
                    .catch(e => res.status(501).jsonp({ error: e }))
            }
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});


//ADMIN: apenas o admin pode alterar o lvl de um user
router.post('/atualizalvl/:id', function (req, res) {
    console.log(req.body.level)
    console.log(req.params.id)
    if (req.user.level == 'admin') {
        User.alterarLevel(req.params.id, req.body.level)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(501).jsonp({ error: e }))
    } else {
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    }
});


//adiciona um follower
router.get('/addFollower/:id', function (req, res) {
    console.log(req.params.id)
    User.addFollower(req.user._id, req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({ error: e }))
});


//Obtem followers de um User
router.get('/getFollowers/:id', function (req, res) {
    
    console.log(req.params.id)
    console.log(req.user._id)
    User.getFollowers(req.params.id)
        .then(dados => {
            console.log(dados)
            res.status(200).jsonp(dados)
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});


//Obtem users que um User está a seguir
router.get('/getFollowing/:id', function (req, res) {
    console.log("chega ao getFollowing")
    console.log(req.params.id)
    User.getFollowingAgr(req.params.id)
        .then(dados => {
            console.log(dados)
            res.status(200).jsonp(dados)
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});

// router.get('/getFollowingListId/:id', function (req, res) {
//     console.log("chega ao getFollowing")
//     console.log(req.params.id)
//     User.getFollowing(req.params.id)
//         .then(dados => {
//             console.log(dados)
//             res.status(200).jsonp(dados)
//         })
//         .catch(e => res.status(501).jsonp({ error: e }))
// });

//remove um follower
router.get('/unFollow/:id', function (req, res) {
    //console.log(req.params.id)
    //console.log(req.user._id)
    User.getUser(req.user._id)
        .then(dados => {
            //console.log("morre aqui")
            if (dados.followers.includes(req.params.id)) {
                //console.log('entra')
                var foll = dados.followers
                //console.log(foll.indexOf(req.params.id))
                var ind = foll.indexOf(req.params.id)
                //console.log(ind) 

                foll.splice(ind, 1)
                //console.log(foll)
                User.unFollower(req.user._id, foll)
                    .then(dadosRec => {
                        //console.log("erro aqui")
                        //console.log(dadosRec)
                        res.status(200).jsonp(dadosRec)})
                    .catch(e => res.status(501).jsonp({ error: e }))
            }else
                res.status(401).jsonp({ error: "Utilizador não existe!" })
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});


router.get('/remove/:id', function (req, res) {
    console.log(req.params.id)
    if (req.user.level == 'admin') {
        User.removeUser(req.params.id)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(501).jsonp({ error: e }))
    } else {
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    }
});

router.get('/:id', function (req, res) {
    console.log(req.params.id)
    User.getUser(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({ error: e }))
});


module.exports = router;