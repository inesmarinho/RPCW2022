// npm install --save md5-file
// npm install node-stream-zip
const md5File = require('md5-file');
const StreamZip = require('node-stream-zip');
const fs = require("fs");


module.exports = {
    StoreSIP : function (zip_name){
        const base = "./fileSystem/storage"; //MUDAR PATH PARA FICAR NA PASTA PUBLIC
        var mypath = ""
    
        /* versão com promessa (asincrino) */
        mypath = md5File(zip_name).then((hash) => {
            console.log(zip_name)
            console.log(`The MD5 sum is: ${hash}`)
        
            // A hash tem o tamanho de 32 chars, mas vamos usar apenas 16 para cada pasta
            // só assim já deve evitar um grande numero de colisões
            let dir1 = hash.substring(0,16)
            let dir2 = hash.substring(16, 32)
        
            console.log(dir1, dir2)
            
            /// CRIAR DIRECTORIAS 
            final_dir = base + '/' + dir1 + '/' + dir2
            console.log(final_dir)
            fs.mkdirSync(final_dir, { recursive: true })
            changePath(final_dir)
    
            /// VERIFICO QUAIS OS FICHEIROS QUE SÂO PDF/XML/PNG/JGP/ ... 
            unzipedFiles = []
            const zip = new StreamZip({
                file: zip_name,
                storeEntries: true
            });
    
            // Esta função procura no zip, sem fazer unzip, isto para o caso de não haver nenhum, pouca tempo
            zip.on('ready', () => {
                // Take a look at the files
                console.log('Entries read: ' + zip.entriesCount);
                for (const entry of Object.values(zip.entries())) {
                    if (!entry.isDirectory){ // se não for uma pasta então verifico a extensão do ficheiro 
                        console.log(`Entry ${entry.name}`);
                        extension = entry.name.split('.').pop().toUpperCase()
                        console.log("Extensão: ", extension)
                        if(extension == 'PDF' || extension == 'XML' || extension == 'PNG' || extension == 'JPG' || extension == 'JPEG!' ){
                            unzipedFiles.push(entry.name)
                        }
                    }
                }
            
                /// Depois de verificar quais os ficheiros que podem ficar fora, então é feito o unzip desses
                /// para o directorio criado enteriormente... (registo/hash/hash/..)
                unziped_path = final_dir + '/' + 'unziped'
                fs.mkdirSync(unziped_path, { recursive: true })
                for (var i = 0; i < unzipedFiles.length; i++){
                    console.log("elem === ", unzipedFiles[i])
                    filename = unzipedFiles[i].split('/').pop()
                    console.log("FILENAME == ", filename)
                    console.log("PATH == ", unziped_path + '/' + filename)
                    zip.extract(unzipedFiles[i], unziped_path + '/' + filename, err => {
                        console.log(err ? 'Extract error: '+ err : 'Extracted');
                        //zip.close();
                    });
                }
                console.log("Ficheiros mostraveis: ", unzipedFiles)
                //zip.close()
            });
            //zip.close();
            file_zip = zip_name.split('/').pop()
            // Aqui estou a mover o ficheiro zip, para o directorio criado com as hashs
            fs.rename('./' + zip_name, final_dir + '/' + file_zip, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
              })
            
            return final_dir
        })
        return mypath
    }
};



function changePath(new_path){
    mypath = new_path
    console.log("mypath --------------------> ", mypath)
}


// Executar desta forma:
// StoreSIP('template.zip').then((x)=>{
//     console.log("FINAL DIR =======================================> ", x) // este valor ainda não está a dar correcto.
// })

// Desta forma a promessa fica pendente, desta maneira a variavel não tem o resultado:
// x = StoreSIP('template4.zip')
// console.log("FINAL DIR =======================================> ", x)


