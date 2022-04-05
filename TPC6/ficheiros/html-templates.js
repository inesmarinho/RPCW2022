exports.fileList = fileList
exports.fileForm = fileForm

// File Form HTML Page Template ------------------------------------------
function fileForm( d ){
    return `
    <html>
        <head>
            <title>Adicionar Ficheiros</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="/favicon.png"/>
            <link rel="stylesheet" href="/w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container ">
                <h2><b>Adicionar Ficheiros</b></h2>
            </div>

            <form class="w3-container" action="/files" method="POST" enctype="multipart/form-data">
                <input class="w3-input w3-border w3-light-grey" type="file" name="myFile">
                <p><label>Descrição:</label></p>
                <input class="w3-input w3-border" type="text" name="descricao">
                <input class="w3-btn w3-blue-grey w3-section" type="submit" value="Submeter"/>
                <address>Introduzido por Inês Marinho :: RPCW2022 em ${d}</address>
            </form>
        </body>
    </html>`
}

// File List HTML Page Template  -----------------------------------------
function fileList( files, d){
    let pagHTML = `
      <html>
          <head>
              <title>Lista de Ficheiros</title>
              <meta charset="utf-8"/>
              <link rel="icon" href="/favicon.png"/>
              <link rel="stylesheet/w3.css"/>
              </head>
          <body>
              <div class="w3-card-4 modal" id="display"></div>

              <div class="w3-container">
                  <h2><b>Lista de Ficheiros</b></h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Data</th>
                      <th>Nome do Ficheiro</th>
                      <th>Descrição</th>
                      <th>Tamanho</th>
                      <th>Tipo</th>
                  </tr>`
    files.forEach( f => {
      pagHTML += `
          <tr onclick='showImage(\"${f.name}", \"${f.mimetype}\");'>
              <td>${f.date}</td>
              <td>${f.name}</td>
              <td>${f.descricao}</td>
              <td>${f.size}</td>
              <td>${f.mimetype}</td>
              <td> 
                    <form class="w3-container" action="/files/delete" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="myFile" value=${f.name}>
                    <input class="w3-btn w3-blue-grey" type="submit" value="Remover"/>
                    </form>
              </td>
          </tr>

      `
    })
    pagHTML += `
          </table>
          <footer>
        <div class="w3-container w3-light-grey">
            <h5><center> Inês Marinho | RCPW 2022</center></h5>
        </div>
    </footer>
      </body>
      </html>
    `
    return pagHTML
  }