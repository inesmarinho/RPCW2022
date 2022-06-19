var express = require('express');
var router = express.Router();
const Comments = require('../controllers/comments')
const Recurso = require('../controllers/recurso')
const Classificacao = require('../controllers/classifications')
const User = require('../controllers/user')

//funciona
//ADMIN:ver todo tipo de publicações, apenas admin
router.get('/', function (req, res) {
  if (req.user.level == 'admin') {
    Recurso.getAll()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({ error: e }))
  } else {
    res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
  }
});


//inserir um recurso
router.post('/', function (req, res) {
  console.log("entra no post com o res: ");
  console.log(req.body)

  Recurso.inserir(req.body)
    .then(dados => {
      Classificacao.inserir(dados._id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({ error: e }))
    })
    .catch(e => {
      res.status(501).jsonp({ erro: e })
    })
});


//ADMIN : ver todos os recursos não apagados
router.get('/Deleted', function (req, res) {
  if (req.user.level == 'admin') {
    Recurso.getAllDeleted()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({ error: e }))
  } else {
    res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
  }
});

//ADMIN : ver todos os recursos apagados
router.get('/noDeleted', function (req, res) {
  if (req.user.level == 'admin') {
    Recurso.getAllNoDeleted()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({ error: e }))
  } else {
    res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
  }
});

//Utilizador vẽs os seu recursos
router.get('/getMyRec', function (req, res) {
  Recurso.getMyRec(req.user._id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({ error: e }))
});


// ver os recursos de um user dado o seu id, se o estiver seguir pode ver publicas
// e privadas, se não estiver a seguir apenas vê as publicas
router.get('/userRecurso/:id', function (req, res) {
  console.log("ENTREI111")
  User.getUser(req.user._id)
    .then(dados => {
      if (req.user._id == req.params.id || req.user.level == 'admin') {
        Recurso.getRecFromUser(req.params.id)
          .then(dadosR => {
            console.log(dadosR)
            res.status(200).jsonp(dadosR)
          })
          .catch(e => res.status(502).jsonp({ error: e }))
      } else {
        Recurso.getRecFromUserPublic(req.params.id)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(503).jsonp({ error: e }))
      }

    })
    .catch(e => res.status(501).jsonp({ error: e }))
});

//recursos públicos(expolkicação identica à de baixo)
router.post('/public', function (req, res) {

  if (Object.keys(req.body).length != 0) {
    if (req.body[0]['titulo'] != undefined && req.body[0]['tipo'] != undefined) { //com filtro para o nome e titulo
      Recurso.getAllPublicWithNameAndTipo(req.body[0]['tipo'], req.body[0]['titulo'])
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(501).jsonp({ error: e }))
    } else
      if (req.body[0]['titulo'] != undefined) { //com filtro para o titulo
        Recurso.getAllPublicWithName(req.body[0]['titulo'])
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        if (req.body[0]['tipo'] != undefined) { //com filtro para tipo
          Recurso.getAllPublicWithTipo(req.body[0]['tipo'])
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(501).jsonp({ error: e }))
        }
  } else {
    Recurso.getAllPublic()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({ error: e }))
  }
});

router.post('/following', function (req, res) {

  User.getFollowing(req.user._id)
    .then(followList => {
      //como é um post verifico se o body vem vazio assim não tem filtros
      if (followList.followers.length != 0) {
        if (Object.keys(req.body).length != 0) {
          //tem os dois filtros
          if (req.body[0]['titulo'] != undefined && req.body[0]['tipo'] != undefined) { //com filtro para o nome e titulo
            Recurso.getAllFollowWithNameAndTipo(followList.followers,req.body[0]['tipo'], req.body[0]['titulo'])
              .then(dados => res.status(200).jsonp(dados))
              .catch(e => res.status(501).jsonp({ error: e }))
          } else
          //tem filtro para o titulo
            if (req.body[0]['titulo'] != undefined) { //com filtro para o titulo
              Recurso.getAllFollowWithName(followList.followers,req.body[0]['titulo'])
                .then(dados => res.status(200).jsonp(dados))
                .catch(e => res.status(501).jsonp({ error: e }))
            } else
            //tem filtro para o tipo
              if (req.body[0]['tipo'] != undefined) { //com filtro para tipo
                Recurso.getAllFollowWithTipo(followList.followers,req.body[0]['tipo'])
                  .then(dados => res.status(200).jsonp(dados))
                  .catch(e => res.status(501).jsonp({ error: e }))
              }
        } else {
          Recurso.getAllFollow(followList.followers)
            .then(dados => {
              res.status(200).jsonp(dados)
            })
            .catch(e => res.status(501).jsonp({ error: e }))
        }
      }else{
        res.status(200).jsonp({})
      }
    })
    .catch(e => res.status(503).jsonp({ error: e }))
});

//altera o estado true == public false == private, vai no body
//apenas quem criou ou o admin pode alterar
router.post('/alteraEstado/:id', function (req, res) {
  console.log(req.params.id)
  Recurso.getRecurso(req.params.id)
    .then(dados => {
      if (dados[0].user == req.user._id || req.user.level == 'admin') {
        Recurso.alterarPublicoPrivato(req.params.id, req.body.estado)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    })
    .catch(e => res.status(501).jsonp({ error: e }))
});

//alterar o Título do trabalho
//apenas quem criou ou o admin pode alterar
router.post('/alteraTitulo/:id', function (req, res) {
  console.log(req.params.id)
  console.log(req.body.title)
  console.log(req.body)
  Recurso.getRecurso(req.params.id)
    .then(dados => {
      if (dados[0].user == req.user._id || req.user.level == 'admin') {
        Recurso.alterarTitle(req.params.id, req.body.title)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    })
    .catch(e => res.status(501).jsonp({ error: e }))
})

//alterar o author
//apenas quem criou ou o admin pode alterar
router.post('/alteraAuthor/:id', function (req, res) {
  console.log(req.params.id)
  console.log(req.body.author)
  Recurso.getRecurso(req.params.id)
    .then(dados => {
      if (dados[0].user == req.user._id || req.user.level == 'admin') {
        Recurso.alterarAuthor(req.params.id, req.body.author)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    })
    .catch(e => res.status(501).jsonp({ error: e }))
});


//Obtem a classicação de um recurso 
router.post('/classifica/:id', function (req, res) {
  Classificacao.getClassificacaoAll(req.params.id)
    .then(dados => {
      var classifiMedia = dados[0].numClassif * dados[0].classificacao
      var classifiMediaMaisNova =  parseInt(classifiMedia) + parseInt(req.body.classificacao) 
      var classifiFinal = parseInt(classifiMediaMaisNova) / ((dados[0].numClassif) + 1)
      Classificacao.giveClassificacao(req.params.id, classifiFinal, req.user._id)
        .then(dadosR => {
          console.log("Adiciona a classifcação2")
          res.status(200).jsonp(dadosR)
        })
        .catch(e => res.status(501).jsonp({ error: e }))
    })
    .catch(e => res.status(501).jsonp({ error: e }))

});


//remove um conteudo
//apenas quem criou ou o admin o pode fazer
router.get('/remove/:id', function (req, res) {
  Recurso.getRecurso(req.params.id)
    .then(dados => {
      if (dados[0].user == req.user._id || req.user.level == 'admin') {
        Recurso.removeRecurso(req.params.id, req.user._id)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    })
    .catch(e => res.status(501).jsonp({ error: e }))
});


//recupera um conteúdo
//se for um user a remover este pode recuperar se for o admin apenas 
//um admin pode recuperar
router.get('/recupera/:id', function (req, res) {
  console.log(req.params.id)
  Recurso.getRecurso(req.params.id)
    .then(dados => {
      console.log(dados[0].user)
      console.log(req.user._id)
      if (dados[0].deleteUser == req.user._id || req.user.level == 'admin') {
        Recurso.recuperaRecurso(req.params.id)
          .then(dados => res.status(200).jsonp(dados))
          .catch(e => res.status(501).jsonp({ error: e }))
      } else
        res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
    })
    .catch(e => res.status(501).jsonp({ error: e }))
});


//Ver um recurso, ao fazer isto pode ver o conteudo,os comentários e a classificação
router.get('/:id', function (req, res) {
  Recurso.getRecursoAgr(req.params.id)
    .then(dados => {
      if (dados[0].user == req.user._id || req.user.level == 'admin') {
        //se for admin ou o dono pode ver tudo incluido estando apagado ou ou privado
        res.status(200).jsonp(dados)
      } else
        if (dados[0].public == true && dados[0].deleted == false) {
          //se estiver publico e não eliminado qq um pode ver
          res.status(200).jsonp(dados)
        } else
          if (dados[0].public == false) {
            //se estiver privado só se estiver a seguir é que pode ver
            User.getFollowing(req.user._id)
              .then(dadosRec => {
                if (dadosRec.followers.includes(dados[0].user)) {
                  res.status(200).jsonp(dados)
                } else
                  res.status(401).jsonp({ error: "Não tem premissões premissões, falar com o Admin" })
              })
              .catch(e => res.status(501).jsonp({ error: e }))
          }
    })
    .catch(e => res.status(501).jsonp({ error: e }))

});


module.exports = router;
