const http = require('http');
const url = require('url');
const axios = require('axios');


function generateMainPage(){
    page = `<!DOCTYPE html>
        <html>
            <head> 
                <meta charset="UTF-8"/>
            </head>
            <body> 
                <h1>
                    Página Principal 
                </h1> 
                <ul>
                    <li>
                        <a href="http://localhost:4000/alunos">
                            Lista de Alunos 
                        </a> 
                    </li>
                    <li>
                        <a href="http://localhost:4000/cursos">
                            Lista de Cursos
                        </a> 
                    </li>
                    <li>
                        <a href="http://localhost:4000/instrumentos">
                            Lista de Instrumentos
                        </a> 
                    </li>
                </ul>
            </body>
        </html>
    `
    return page
}

function generateStudentsList(res){
    page = `<!DOCTYPE html>
        <html>
            <head> 
                <meta charset="UTF-8"/>
            </head>
            <body> 
                <h2> Tabela Alunos 
                </h2>
                <table>
                    <tr>
                        <th> Id </th>
                        <th> Nome </th>
                        <th> Curso </th>
                        <th> Instrumento </th>
                    </tr>
            `
    axios.get("http://localhost:3001/alunos")
        .then(function (resp) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            alunos = resp.data
            alunos.forEach(a => {
                page += `
                    <tr>
                        <td> ${a.id} </th>
                        <td> ${a.nome} </th>
                        <td> ${a.curso} </th>
                        <td> ${a.instrumento} </th>
                    </tr>
                        `
            });
            page += `
                </table>
            </body>
        </html>`
        res.write(page)
        res.end()
        })
        .catch(function (error) {
            console.log(error)
        });
}

function generateCourseList(res){
    page = `<!DOCTYPE html>
        <html>
            <head> 
                <meta charset="UTF-8"/>
            </head>
            <body> 
                <h2> Tabela Cursos 
                </h2>
                <table>
                    <tr>
                        <th> Id </th>
                        <th> Designação </th>
                        <th> Duração </th>
                    </tr>
            `
    axios.get("http://localhost:3001/cursos")
        .then(function (resp) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            cursos = resp.data
            cursos.forEach(c => {
                console.log(c)
                page += `
                    <tr>
                        <td> ${c.id} </th>
                        <td> ${c.designacao} </th>
                        <td> ${c.duracao} </th>
                    </tr>
                        `
            });
            page += `   </table>
            </body>
        </html>`
        
        res.write(page)
        res.end()
        })
        .catch(function (error) {
            console.log(error)
        });
}

function generateInstrumentsList(res){
    page = `<!DOCTYPE html>
        <html>
            <head> 
                <meta charset="UTF-8"/>
            </head>
            <body> 
                <h2> Tabela Instrumentos 
                </h2>
                <table>
                    <tr>
                        <th> Id </th>
                        <th> Designação </th>
                    </tr>
            `
    axios.get("http://localhost:3001/instrumentos")
        .then(function (resp) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            instrumentos = resp.data
            instrumentos.forEach(i => {
                console.log(i)
                page += `
                        <tr>
                            <td> ${i.id} </th>
                            <td> ${i['#text']} </th>
                        </tr>
                        `
            });
            page += `   </table>
            </body>
        </html>`
        res.write(page)
        res.end()
        })
        .catch(function (error) {
            console.log(error)
        });
}

myserver = http.createServer(function(req, res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname
    if (myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write(generateMainPage())
        res.end()

    }
    else if (myurl== "/alunos"){
        generateStudentsList(res)
    }
    else if (myurl== "/cursos"){
        generateCourseList(res)
    }
    else if (myurl== "/instrumentos"){
        generateInstrumentsList(res)
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("<p> Rota não suportada: " + req.url + "</p>")
    }
})

myserver.listen(4000)
console.log('Servidor á escuta na porta 4000')


