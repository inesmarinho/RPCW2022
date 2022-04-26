var express = require('express');
var router = express.Router();
var Para = require('../controllers/para');

/* GET home page. */
// Lista parágrafos 
router.get('/paras', function(req, res) {
  Para.listar()
    .then(dados => {
      console.log("dados: " + dados)
      res.status(200).jsonp(dados)
    })
    .catch(e => {
      res.status(500).jsonp({erro: e})
    })    
});

// Insere parágrafos
router.post('/paras', function(req, res) {
  Para.inserir(req.body)
    .then(data => {
      res.status(201).jsonp(data)
    })
    .catch(err => {
      res.status(501).jsonp(err)
    })     
});

// Edita parágrafo

// Remove parágrafo

module.exports = router;
