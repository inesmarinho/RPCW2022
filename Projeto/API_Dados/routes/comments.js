var express = require('express');
var router = express.Router();
const Comments = require('../controllers/comments')
const Recurso = require('../controllers/recurso')
const User = require('../controllers/user')

//Fazer um commentário
router.post('/:id', function (req, res) {
    req.body.user = req.user._id
    req.body.recurso = req.params.id
    Comments.inserir(req.body)
        .then(dados => {
            res.status(201).jsonp(dados);
        })
        .catch(e => {
            res.status(501).jsonp({ erro: e })
        })
});


//obtem comentários de um recurso
router.get('/recurso/:id', function (req, res) {
    if (req.user.level == 'admin') {
        console.log("entra aqui")
        Comments.GetCommentsRecurso(req.params.id)
            .then(dados => {
                console.log(dados)
                res.status(200).jsonp(dados)})
            .catch(e => res.status(501).jsonp({ error: e }))

    } else {
        Comments.GetCommentsRecurso(req.params.id)
            .then(dados => {
                res.status(200).jsonp(dados)
            })
            .catch(e => res.status(501).jsonp({ error: e }))
    }
});


//remove um comentário
router.get('/remove/:id', function (req, res) {

    Comments.GetComment(req.params.id)
        .then(dados => {
            if (dados[0].user == req.user._id | req.user.level == 'admin') {
                Comments.removeComment(req.params.id, req.user._id)
                    .then(dadosR => {
                        res.status(200).jsonp(dadosR)})
                    .catch(e => res.status(501).jsonp({ error: e }))
            }else
            res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});


//Talvez não deva recuperar comments
router.get('/recuperar/:id', function (req, res) {
    Comments.getRecurso(req.params.id)
        .then(dados => {
            if (dados[0].deleteUser == req.user._id || req.user.level == 'admin') {
                Recurso.removeRecurso(req.params.id, req.user._id)
                    .then(dados => res.status(200).jsonp(dados))
                    .catch(e => res.status(501).jsonp({ error: e }))
            } else
                res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
        })
        .catch(e => res.status(501).jsonp({ error: e }))
});


//procurar comment especifico
router.get('/:id', function (req, res) {
    Comments.GetComment(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({ error: e }))
});



module.exports = router;

