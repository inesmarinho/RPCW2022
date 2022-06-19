"use strict";

var express = require('express');

var router = express.Router();

var axios = require('axios');

router.get('/:id', function (req, res) {
  console.log("entra");
  console.log(req.cookies.data.token); //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)

  axios.post('http://localhost:7002/recursos/' + req.params.id + '?token=' + req.cookies.data.token).then(function (dados) {
    console.log("guarda");
    console.log(dados); //dados.data)

    res.render('public', {
      navbar: req.cookies.data.userData,
      recursos: dados.data
    });
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
});