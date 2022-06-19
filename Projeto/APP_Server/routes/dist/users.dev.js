"use strict";

var express = require('express');

var router = express.Router();

var axios = require('axios');
/* GET users listing. */


router.get('/', function (req, res, next) {
  axios.get('http://localhost:7002/users/?token=' + req.cookies.data.token).then(function (users) {
    res.render('users', {
      navbar: req.cookies.data.userData,
      users: users.data,
      title: 'Utilizadores'
    });
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
});
router.get('/:id', function (req, res) {
  console.log("entra");
  console.log("ID ==== ", req.params.id);
  console.log("TOKEN ==== ", req.cookies.data.token); //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)

  axios.get('http://localhost:7002/users/' + req.params.id + '?token=' + req.cookies.data.token).then(function (dados) {
    console.log("guarda"); //console.log(req.cookies.data.userData)//dados.data)

    console.log("dados: ", dados.data);
    axios.get('http://localhost:7002/recursos/userRecurso/' + req.params.id + '?token=' + req.cookies.data.token).then(function (recursos) {
      console.log("Consegui os dados dos recursos");
      console.log("dados: ", recursos.data);
      axios.get('http://localhost:7002/users/getFollowers/' + req.params.id + '?token=' + req.cookies.data.token).then(function (myfollowers) {
        var flagLevel;

        if (req.cookies.data.userData.level == 'admin') {
          flagLevel = 'admin';
          res.render('user', {
            navbar: req.cookies.data.userData,
            user: dados.data,
            recursos: recursos.data,
            myfollowers: myfollowers.data,
            flagLevel: flagLevel
          });
        } else if (dados.data._id == req.cookies.data.userData.id) {
          flagLevel = 'dono';
          res.render('user', {
            navbar: req.cookies.data.userData,
            user: dados.data,
            recursos: recursos.data,
            myfollowers: myfollowers.data,
            flagLevel: flagLevel
          });
        } else {
          flagLevel = 'visitante';
          res.render('user', {
            navbar: req.cookies.data.userData,
            user: dados.data,
            recursos: recursos.data,
            myfollowers: myfollowers.data,
            flagLevel: flagLevel
          });
        }
      })["catch"](function (e) {
        return res.render('error', {
          error: e
        });
      });
    })["catch"](function (e) {
      return res.render('error', {
        error: e
      });
    });
  })["catch"](function (e) {
    return res.render('error', {
      error: e
    });
  });
});
module.exports = router;