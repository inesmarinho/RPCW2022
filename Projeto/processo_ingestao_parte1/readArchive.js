// Lê e lista todos os ficheiros num arquivo ZIP usando adm-zip

const AdmZip = require("adm-zip");
const crypto = require("crypto");

async function readZipArchive(filepath) {
  try {
    const zip = new AdmZip(filepath);
    let files_in_zip = new Map();
    let files_in_manifest = new Array();

    const zipEntries = zip.getEntries();

    if (!zipEntries.some(elem => elem.name == 'RRD-SIP.json')){
      throw " O ficheiro RRD-SIP.json não existe existe"
    }

    for (const zipEntry of zipEntries){

      if (zipEntry.name == 'RRD-SIP.json'){
        files_in_manifest = JSON.parse(zipEntry.getData().toString('utf8'))
      }    
      else{
        if (!zipEntry.name.startsWith(".") && zipEntry.name != ""){
          const fileName = zipEntry.name
          const md5Hash = crypto.createHash('md5').update(zipEntry.getData()).digest('hex');
          files_in_zip.set(fileName, md5Hash)

        } 
      }
    }
    files_in_manifest.forEach(elem => {
        if (!files_in_zip.has(elem.file)){
            throw "Ficheiro " + elem.file + " referenciado no RRD-SIP.json, mas não existe no pacote enviado." 
        }
        else{
          const originalMd5Hash = elem.hash
          if (originalMd5Hash == files_in_zip.get(elem.file)){
            files_in_zip.delete(elem.file)
          }
          else{
            throw "Ficheiro " + elem.file + " com hash não correspondente." 
          }
        }
    })
    if (files_in_zip.size > 0) throw "Ficheiros não referenciados no RRD-SIP.json, mas existem no pacote enviado."
    console.log("Todos os ficheiros referenciados no RRD-SIP.json existem no pacote enviado.")
  }      
  catch (e) {
    console.log(`Erro: ${e}`);
  }
}

readZipArchive("./mybagit_teste_3.zip");

