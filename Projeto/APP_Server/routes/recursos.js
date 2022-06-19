var express = require('express');
var router = express.Router();
var axios = require('axios')
var storing = require('../public/javascripts/store')
var verification = require('../public/javascripts/verifyFile')
var fs = require('fs')

const multer  = require('multer')
var storage = multer.diskStorage({
    destination: './fileSystem/uploads',
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  });
const upload = multer({ storage: storage })

router.get('/new', function (req, res) {

    res.render('novo_recurso', { navbar: req.cookies.data.userData, userId: req.cookies.data.userData.id})
})

router.post('/new', upload.single('path'), function (req, res) {

    if(req.body.public == "true"){
        req.body.public = true
    }
    else{
        req.body.public = false
    }
    verification.verifyFile(req.file.path).then(verf => {

        if (verf){
            storing.StoreSIP(req.file.path).then((x)=>{
                req.body.path = x
                axios.post('http://localhost:7002/recursos?token=' + req.cookies.data.token, req.body)
                .then(dados => {
                    res.redirect('/inicio')
                })
                .catch(e => res.render('error', { error: e }))
            })
        }
        else{
            res.redirect('new')
        }
    })
    //res.redirect('/inicio')
})


router.post('/classifica/:id', function (req, res) {
    axios.post('http://localhost:7002/recursos/classifica/' + req.params.id + '?token=' + req.cookies.data.token, req.body)
    .then(dados => {
        res.redirect('/recursos/' + req.params.id)
    })
    .catch(e => res.render('error', { error: e }))
})
   

router.get('/deleteRecurso/:id', function (req, res) {
    axios.get('http://localhost:7002/recursos/remove/' + req.params.id + '?token=' + req.cookies.data.token)
        .then(dados => {
            res.redirect('/users/' + req.query.user)
        })
        .catch(e => res.render('error', { error: e }))
})

router.get('/recuperarRecurso/:id', function (req, res) {
    axios.get('http://localhost:7002/recursos/recupera/' + req.params.id + '?token=' + req.cookies.data.token)
        .then(dados => {
            res.redirect('/recursos/' + req.params.id)
        })
        .catch(e => res.render('error', { error: e }))
})

router.get('/download/:id', function (req, res) {
    axios.get('http://localhost:7002/recursos/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(dados => {
        var zip_name = ""
        var zip_files = fs.readdirSync(dados.data[0].path);
        for (fich in zip_files){
            let tmp = zip_files[fich].split('.').pop()
            if (tmp == "zip"){
                zip_name = zip_files[fich]
            }
        }
        res.download(dados.data[0].path + '/' + zip_name)
    })
    .catch(e => res.render('error', { error: e }))
})


router.get('/:id', function (req, res) {

    axios.get('http://localhost:7002/recursos/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(dados => {
        var zip_name = ""
        var files = fs.readdirSync(dados.data[0].path + '/unziped');
        var zip_files = fs.readdirSync(dados.data[0].path);
        for (fich in zip_files){
            let tmp = zip_files[fich].split('.').pop()
            if (tmp == "zip"){
                zip_name = zip_files[fich]
            }
        }
        axios.get('http://localhost:7002/comments/recurso/' + req.params.id + '?token=' + req.cookies.data.token)
        .then(dadosRec => {
            var flagQuemApagou
            if(dados.data[0].deletedUser == req.cookies.data.userData.id)
                flagQuemApagou = 'dono'
            else 
               if(dados.data[0].deleted == true && dados.data[0].deleteUtilizador.level == 'admin')

                    flagQuemApagou = 'admin'
                else
                    flagQuemApagou = 'visitante'
            
                    var flagLevel
            if (req.cookies.data.userData.level == 'admin') {
                flagLevel = 'admin'
            } else
            if (dados.data[0].user == req.cookies.data.userData.id) {
                flagLevel = 'dono'
                
            } else {
                flagLevel = 'visitante'
            }
            res.render('recurso', { navbar: req.cookies.data.userData, userData: dados.data[0].utilizador[0], recurso: dados.data[0], flagLevel:flagLevel, comentarios:dadosRec.data, ficheiros: files, zip_name: zip_name, flagQuemApagou: flagQuemApagou })
        })
        })
        .catch(e => res.render('error', { error: e }))
});

module.exports = router;
    