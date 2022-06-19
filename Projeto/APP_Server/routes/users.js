var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', function (req, res) {
  axios.get('http://localhost:7002/users/?token=' + req.cookies.data.token)
    .then(users => {
      res.render('users', { navbar: req.cookies.data.userData, users: users.data, title: 'Utilizadores' })
    })
    .catch(e => res.render('error', { error: e }))
});

router.get('/following/:id', function (req, res) {
  axios.get('http://localhost:7002/users/getFollowing/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(users => {
      res.render('users', { navbar: req.cookies.data.userData, users: users.data[0].utilizador, title: 'Following' })
    })
    .catch(e => res.render('error', { error: e }))
});

router.get('/followers/:id', function (req, res) {
  axios.get('http://localhost:7002/users/getFollowers/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(users => {
      res.render('users', { navbar: req.cookies.data.userData, users: users.data, title: "Followers" })
    })
    .catch(e => res.render('error', { error: e }))
});

//Não feito, Apenas rota
router.post('/editDados/:id', function (req, res) {
  axios.get('http://localhost:7002/users/?token=' + req.cookies.data.token)
    .then(users => {
      res.render('users', { navbar: req.cookies.data.userData, users: users.data, title: 'Utilizadores' })
    })
    .catch(e => res.render('error', { error: e }))
});

//Seguir um user
router.get('/follow/:id', function (req, res) {
  axios.get('http://localhost:7002/users/addFollower/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(users => {
      res.redirect('/users/' + req.params.id)
    })
    .catch(e => res.render('error', { error: e }))
});

//Deixar de seguir um user
router.get('/unfollow/:id', function (req, res) {
  axios.get('http://localhost:7002/users/unFollow/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(users => {
      res.redirect('/users/' + req.params.id)
    })
    .catch(e => res.render('error', { error: e }))
});

router.get('/:id', function (req, res) {
  //axios.post('http://localhost:7002/recursos?token='+ req.cookies.data.token)
  axios.get('http://localhost:7002/users/' + req.params.id + '?token=' + req.cookies.data.token)
    .then(dados => {
      axios.get('http://localhost:7002/recursos/userRecurso/' + req.params.id + '?token=' + req.cookies.data.token)
        .then(recursos => {
          axios.get('http://localhost:7002/users/getFollowers/' + req.params.id + '?token=' + req.cookies.data.token)
            .then(userfollowers => {
              axios.get('http://localhost:7002/users/' + req.cookies.data.userData.id + '?token=' + req.cookies.data.token)
                .then(myfollowers => {
                  var flagLevel
                  if (dados.data._id == req.cookies.data.userData.id) {
                    flagLevel = 'dono'
                  } else if (req.cookies.data.userData.level == 'admin') {
                    flagLevel = 'admin'
                  } else {
                    flagLevel = 'visitante'
                  }
                  
                  var flagSeguir
                  if (myfollowers.data.followers.includes(req.params.id)) {
                    flagSeguir = 'seguindo'
                  }else{
                    flagSeguir = 'NaoSeguindo'
                  }
                  res.render('user', { navbar: req.cookies.data.userData, user: dados.data, recursos: recursos.data, myfollowers: userfollowers.data, flagLevel: flagLevel, flagSeguir:flagSeguir })
                })
                .catch(e => res.render('error', { error: e }))
            })
            .catch(e => res.render('error', { error: e }))
        })
        .catch(e => res.render('error', { error: e }))
    })
    .catch(e => res.render('error', { error: e }))
});

module.exports = router;
