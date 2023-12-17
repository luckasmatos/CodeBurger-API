import express from "express";
import routes from "./routes";
import './database'
import { resolve } from 'path'

const corsOptions = {
  origin: 'https://luckas-codeburger.vercel.app',
  credentials: true,
}

class App {
  constructor() {
    this.app.use(cors(corsOptions))
    this.app = express(); // guardamos o express dentro da variável e exportamos ela por meio do this
    this.middlewares(); // avisamos que utilizaremos toda a aplicação pelo método JSON
    this.routes(); // deixamos nossas rotas disponíveis para rodar assim que inicia a aplicação
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use('/product-file', express.static(resolve(__dirname, "..", "uploads")))
    //quando alguem acessar a rota productfile vc vai permitir que a pessoa terão acesso a arquivos estaticos dentro da minha aplicação + diretorio em que estão os arquivos
    this.app.use('/category-file', express.static(resolve(__dirname, "..", "uploads")))
    //quando alguem acessar a rota category-file vc vai permitir que a pessoa terão acesso a arquivos estaticos dentro da minha aplicação + diretorio em que estão os arquivos
  }

  
  routes() {
    this.app.use(routes); // use é utilizado de acordo com a documentação do express que pede isso
  }
}

export default new App().app;