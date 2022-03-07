var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, res) {
    var myurl = req.url.substring(1) 
    if (myurl === "filmes"){
        myurl = 'index'
    }
    else{
        if (myurl.startsWith("filmes/")){
            myurl = req.url.substring(8)
        }
        else{
            res.write("<p> Página inválida </p>") 
        }
    }
    fs.readFile('/Users/inesmarinho/Desktop/2\ semestre/RPCW/TPC2/' + myurl + '.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'})
        if(err){
            res.write("<p> Erro na leitura de ficheiro...</p>")
        }
        else{
            res.write(data)
        }
        res.end()
    }) 
}).listen(7777)

console.log('Servidor á escuta na porta 7777')