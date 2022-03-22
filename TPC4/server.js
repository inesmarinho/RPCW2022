var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')

// Função auxiliar
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = '' 
        request.on('data', bloco => {
            body += bloco.toString()
            })
            request.on('end', ()=>{
                console.log(body)
                callback(parse(body))
            })
    }
}

// Página inicial
function geraPagInicial(tarefas, d){
    // registar nova tarefa
    let page = `
    <html>
    <head>
        <title>To-Do List</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>  
        
    </head>
    <body>
        <div class="w3-container w3-center">
            <h1>To-Do List</h1>
        </div>
        <div class="w3-container ">
            <h3>Registo de uma nova tarefa</h3>
        </div>

        <form class="w3-container" action="/tarefas" method="POST">
                <p><label>Id da tarefa:</label>
                <input class="w3-input w3-border" type="text" name="id">

                <p><label>Descrição:</label>
                <input class="w3-input w3-border" type="text" name="descricao">
          
                <p><label>Data de início:</label>
                <input class="w3-input w3-border" type="date" name="data">

                <p><label>Tipo:</label>
                <select class="w3-select w3-border" name="tipo">
                    <option value="" disabled selected>Escolha a opção</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Universidade">Universidade</option>
                </select>

                <p><label>Estado:</label>
                <select class="w3-select w3-border" name="estado">
                    <option value="" disabled selected>Escolha a opção</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Concluída">Concluída</option>
                </select>

                <input class="w3-btn w3-blue w3-block w3-section" type="submit" value="Registar"/>
        </form>
    `
    // tabela de tarefas pendentes
    page += `
    <div class="w3-container">
        <h3>Tarefas pendentes</h3>

        <table class="w3-table w3-bordered">
            <tr>
                <th>Id</th>
                <th>Descrição</th>
                <th>Data de início</th>
                <th>Tipo</th>
                <th>Estado</th>
            </tr>`
    tarefas.forEach(t=> {
        if (t.estado == "Pendente"){
            page += `
            <tr>
                <td>${t.id}</td>
                <td>${t.descricao}</td>
                <td>${t.data}</td>
                <td>${t.tipo}</td>
                <td>${t.estado}</td>
                <td> <a href="/tarefas/${t.id}/editar/"> Editar </a> </td>
                <td> <a href="/tarefas/${t.id}/concluida/"> Concluída </a> </td>
            </tr>`
        }
    })
    page += `
        </table>
    </div>`
    // tabela de tarefas concluidas
    page += `
    <div class="w3-container">
        <h3>Tarefas concluidas</h3>

        <table class="w3-table w3-bordered">
            <tr> 
                <th>Id</th>
                <th>Descrição</th>
                <th>Data de início</th>
                <th>Tipo</th>
                <th>Estado</th>
            </tr>`
    tarefas.forEach(t=> {
        if (t.estado == "Concluída"){
            page += `
            <tr>
                <td>${t.id}</td>
                <td>${t.descricao}</td>
                <td>${t.data}</td>
                <td>${t.tipo}</td>
                <td>${t.estado}</td>
                <td> <a href="/tarefas/${t.id}/apagar/"> Apagar</a> </td>
            </tr>`
        }
    })
    page += `
        </table>
    </div>`

page += `
    <footer>
        <div class="w3-container w3-light-grey">
            <h5><center> Inês Marinho | RCPW 2022</center></h5>
        </div>
    </footer>
</body>
</html>`
    return page
}

// Confirmação do registo da tarefa
function geraRegisConfirm(tarefa, d){
    return `
    <html>
    <head>
        <title> Tarefa registada</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1> Tarefa ${tarefa.id} </h1>
                </header>

            <div class="w3-container">
                <p> Tarefa registada com sucesso. </p>
            </div>

            <div class="w3-container">
                <p><a href="/">Voltar</a></p>
            </div>

            <footer>
                <div class="w3-container w3-light-grey">
                    <h5><center> Inês Marinho | RCPW 2022</center></h5>
                </div>
            </footer>
        </div>
        </body>
    </html>
    `         
}

// Apagar tarefa
function apagarTarefa(tarefa, d){
    return `
    <html>
    <head>
        <title> Tarefa elimida</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1> Tarefa ${tarefa.id} </h1>
                </header>

            <div class="w3-container">
                <p> Tarefa eliminada com sucesso. </p>
            </div>

            <div class="w3-container">
                <p><a href="/">Voltar</a></p>
            </div>

            <footer>
                <div class="w3-container w3-light-grey">
                    <h5><center> Inês Marinho | RCPW 2022</center></h5>
                </div>
            </footer>
        </body>
    </html>
    `         
}

// Tarefa concluida
function tarefaConcluida(tarefa, d){
    return `
    <html>
    <head>
        <title> Tarefa concluída com sucesso</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1> Tarefa ${tarefa.id} </h1>
                </header>

            <div class="w3-container">
                <p> Tarefa concluída com sucesso. </p>
            </div>

            <div class="w3-container">
                <p><a href="/">Voltar</a></p>
            </div>

            <footer>
                <div class="w3-container w3-light-grey">
                    <h5><center> Inês Marinho | RCPW 2022</center></h5>
                </div>
            </footer>
        </body>
    </html>
    `         
}

// Editar tarefa
function editaTarefa(tarefa, d){
    return `
    <html>
        <head>
            <title> Editar tarefa com id ${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1> Editar tarefa com id ${tarefa.id} </h1>
                </header>
            <div class="w3-container">

        <form class="w3-container" action="/tarefas/editar" method="POST">
            <p><label>Id da tarefa:</label>
            <input class="w3-input w3-border" type="text" name="autor" value="${tarefa.id}">

            <p><label>Descrição:</label>
            <input class="w3-input w3-border" type="text" name="descricao" value="${tarefa.descricao}">
      
            <p><label>Data de início:</label>
            <input class="w3-input w3-border" type="date" name="data" value="${tarefa.data}">
            
            <p><label>Tipo:</label>
            <select class="w3-select w3-border" name="tipo" value="${tarefa.tipo}">
                <option value="Pessoal">Pessoal</option>
                <option value="Universidade">Universidade</option>
            </select>

            <p><label>Estado:</label>
            <select class="w3-select w3-border" name="estado" value="${tarefa.tipo}">
                
                <option value="Pendente">Pendente</option>
                <option value="Concluída">Concluída</option>
            </select>
            
            <input class="w3-btn w3-blue w3-block w3-section" type="submit" value="Editar"/>        
        </form>

        <div class="w3-container">
                <p><a href="/">Voltar</a></p>
        </div>

        <footer>
            <div class="w3-container w3-light-grey">
            <h5><center> Inês Marinho | RCPW 2022</center></h5>
            </div>
        </footer>

        <body>
    </html>`
}

// Criação do servidor
var server = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // página principal
                if((req.url == "/") || (req.url == "/tarefas")){
                    axios.get("http://localhost:3000/tarefas")
                        .then(response => {
                            var tarefas = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagInicial(tarefas, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas.</p>")
                            res.end()
                        })
                }
                // apagar tarefa
                else if(/\/tarefas\/[0-9]+\/apagar/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.delete("http://localhost:3000/tarefas/" + idTarefa)
                        .then( response => {
                            var a = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(apagarTarefa(idTarefa, d))
                            res.end()
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível apagar a tarefa.</p>")
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
                }
                // tarefa concluida
                else if(/\/tarefas\/[0-9]+\/concluida/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                        axios.get('http://localhost:3000/tarefas/' + idTarefa)
                            .then(response => {
                                var tarefa = response.data
                                tarefa["estado"] = "Concluída"
                                axios.put('http://localhost:3000/tarefas/' + idTarefa, tarefa)
                                    .then(response => {
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write(tarefaConcluida(tarefa, d))
                                        res.end()
                                    })
                                    .catch(erro => {
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write('<p>Erro ao concluir tarefa</p>')
                                        res.write('<p><a href="/">Voltar</a></p>')
                                        res.end()
                                    })
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro ao concluir tarefa</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                }
                // editar tarefa
                else if((/\/tarefas\/[0-9]+\/editar/.test(req.url))){
                    idTarefa = req.url.split("/")[2]
                    axios.put('http://localhost:3000/tarefas/' + idTarefa)
                        .then(resp => {
                            var tarefa = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(editaTarefa(tarefa, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                
                break
            case "POST":
                // confirma registo de tarefa 
                if(req.url == "/tarefas"){
                    recuperaInfo(req, resultado => {
                        console.log('POST de tarefa:' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tarefas', resultado)
                            .then(resp => {
                                var tarefa = resp.data
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraRegisConfirm(tarefa, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recebi um POST não suportado </p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                   }     
                break
        }     
    }
}).listen(7777)
console.log("Servidor à escuta na porta 7777")


