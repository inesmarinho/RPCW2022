var express = require('express');
var router = express.Router();
var axios = require('axios')



router.get('/deleteComentario/:id', function (req, res) {
    
    console.log(req.body)
    axios.get('http://localhost:7002/comments/remove/' + req.params.id + '?token=' + req.cookies.data.token, req.body)
    .then(dados => {
        console.log(dados.data)
        res.redirect('/recursos/' + req.query.recurso)
    })
    .catch(e => res.render('error', { error: e }))
})

router.post('/:id', function (req, res) {

    console.log(req.body)
    axios.post('http://localhost:7002/comments/' + req.params.id + '?token=' + req.cookies.data.token, req.body)
        .then(dados => {
            console.log(dados.data)
            res.redirect('/recursos/' + req.params.id)
        })
        .catch(e => res.render('error', { error: e }))
})
module.exports = router;