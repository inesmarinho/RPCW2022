"use strict";

var express = require('express');

var router = express.Router();

var axios = require('axios'); //get pagina login


router.get('/', function (req, res) {
  res.render('login', {
    title: 'Express'
  });
}); //post do login

router.post('/', function (req, res) {
  console.log(req.body);
  axios.post('http://localhost:7001/login', req.body).then(function (dados) {
    //console.log(dados.data)
    res.cookie('data', dados.data, {
      //guardar os dados num cookie
      expires: new Date(Date.now() + '60m'),
      //validade
      secure: false,
      // set to true if your using https
      httpOnly: true
    }); //console.log(dados.data.userData)

    res.redirect('/inicio');
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
}); //get página registo

router.get('/registar', function (req, res) {
  res.render('registo');
}); //post do registo

router.post('/registar', function (req, res) {
  axios.post('http://localhost:7001/registo', req.body).then(function (dados) {
    console.log(dados.data);
    res.cookie('data', dados.data, {
      //guardar os dados num cookie
      expires: new Date(Date.now() + '60m'),
      //validade
      secure: false,
      // set to true if your using https
      httpOnly: true
    });
    res.redirect('/inicio');
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
}); //

router.get('/inicio', function (req, res) {
  console.log("entra");
  console.log(req.cookies.data.token); //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)

  axios.post('http://localhost:7002/recursos/public?token=' + req.cookies.data.token).then(function (dados) {
    console.log("guarda");
    res.render('public', {
      user: req.cookies.data.userData
    });
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
});
module.exports = router;