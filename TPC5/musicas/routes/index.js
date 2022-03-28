var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// lista de músicas
router.get('/musicas', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
    .then(response => {
      var mus = response.data
      res.render('musicas', {lmusicas: mus});
    })
    .catch(function(erro){
      res.render('error',{error : erro});
    })
});

// página da música
router.get('/musicas/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?id=" + req.params.id) 
    .then(response => {
      var dados = response.data[0]
      res.render('musica', {musica: dados});
    })
    .catch(function(erro){
      res.render('error',{error : erro});
    })
});

// lista de músicas de cada província
router.get('/musicas/prov/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?prov=" + req.params.id)
    .then(response => {
      var prov = response.data
      res.render('lmprov', {musicas: prov});
    })
    .catch(function(erro){
      res.render('error',{error : erro});
    })
});

module.exports = router;
