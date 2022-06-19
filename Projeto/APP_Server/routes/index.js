var express = require('express');
var router = express.Router();
var axios = require('axios')

function addMinutes(minutes) {
  var MinutesLater = new Date();
  MinutesLater.setMinutes(MinutesLater.getMinutes() + minutes);
  return MinutesLater;
}

//get pagina login
router.get('/', function (req, res) {
  res.render('login', { title: 'Express' });
});

//post do login
router.post('/', function (req, res) {

  axios.post('http://localhost:7001/login', req.body)
    .then(dados => {

      res.cookie('data', dados.data, {   //guardar os dados num cookie
        expires: addMinutes(20),  //validade
        secure: false, // set to true if your using https
        httpOnly: true
      });

      res.redirect('/inicio')
    })
    .catch(e => res.render('error', { error: e }))
    //res.redirect('/inicio')
});

//get página registo
router.get('/registar', function (req, res) {
  res.render('registo');
});

//post do registo
router.post('/registar', function (req, res) {
  axios.post('http://localhost:7001/registo', req.body)
    .then(dados => {
      res.cookie('data', dados.data, {   //guardar os dados num cookie
        expires: addMinutes(20),  //validade
        secure: false, // set to true if your using https
        httpOnly: true
      });
      res.redirect('/inicio')
    })
    .catch(e => res.render('error', { error: e }))
});


//
router.get('/public', function (req, res) {
  //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)
  axios.post('http://localhost:7002/recursos/public?token=' + req.cookies.data.token,{})
    .then(dados => {
      res.render('public', { navbar: req.cookies.data.userData, recursos: dados.data, title:'Feed Publico' })
    })
    .catch(e => res.render('error', { error: e }))
}); 

router.get('/inicio', function (req, res) {
  //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)
  axios.post('http://localhost:7002/recursos/following?token=' + req.cookies.data.token,{})
    .then(dados => {
      res.render('public', { navbar: req.cookies.data.userData, recursos: dados.data, title:'Feed Noticias' })
    })
    .catch(e => res.render('error', { error: e }))
});



module.exports = router;
