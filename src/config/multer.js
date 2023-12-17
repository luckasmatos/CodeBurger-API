import multer from "multer";
import { v4 } from "uuid";
import { extname, resolve } from 'path'; //path é uma biblioteca do Node que temos acesso
//extname: pega apenas a extensão do arquivo (minhafoto.png = ele vai pegar só o ".png")

export default { //vamos exportar tudo já sem variável
    storage: multer.diskStorage({ //precisamos passar o local em que vamos guardar + o nome do arquivo
        destination: resolve(__dirname, "..", "..", "uploads"),     // O "resolve" nos ajuda a navegar entre pastas
        filename: (request, file, callback) => {
            return callback(null, v4() + extname(file.originalname))
        }
    })
}

//codigos acima baseado nas configurações da biblioteca Multer
//ideal é guardar no CDN que é um servidor para guardar imagens, mas nessa aplicação vamos salvar aqui dentro dela
// não utilizamos o nome do arquivo para que não tenha perigo de salvar dois arquivos com o mesmo nome
// filename é uma função (multer) // calback espera um erro + um acerto //utilizamos o v4 para gerar um número aleatório que não vai se repetir;
//extname funciona requerendo: qual é o arquivo que vc quer pegar a extenção (do file vem muita informação então utilizamos o ".originalname" para pegar apenas o nome do arquivo)