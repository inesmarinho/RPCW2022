var express = require('express');
var logger = require('morgan');
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var fs = require('fs')

var multer = require('multer')
var upload = multer({dest : 'uploads'})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('*', (req, res, next) => {
  console.log('Recebi um GET')
  next()
})

// página inicial com form e com lista de ficheiros
app.get('/', (req, res) => {
  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')
  res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
  res.write(templates.fileForm(d))
  res.write(templates.fileList(files, d))
  res.end()
})

// submeter ficheiros
app.post('/files', upload.single('myFile'), (req, res) => {
  let oldPath = __dirname + '/' + req.file.path
  let newPath = __dirname + '/fileStore' + req.file.originalname

  fs.rename(oldPath, newPath, erro => {
    if(erro) throw erro
  })

  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')

  files.push({
    date : d,
    name : req.file.originalname,
    descricao : req.body.descricao, 
    mimetype : req.file.mimetype,
    size : req.file.size
  })

  jsonfile.writeFileSync('./dbFiles.json', files)

  res.redirect('/')
})

// apagar ficheiros
app.post('/files/delete', upload.single('myFile'), (req, res) => {
  var filename= req.body.myFile  
  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')
  var i 
  for (i = 0; i < files.length; i++){
    if(files[i].name == filename){
      files.splice(i, 1)
    }
  }  
  jsonfile.writeFileSync('./dbFiles.json', files)
  res.redirect('/')
})

app.listen(3030, () => console.log("Servidor à escuta na porta 3031"))

module.exports = app;

