import express from "express"
import routes from "./routes.js"
import './database/index.js'
import { resolve } from 'path'
import cors from 'cors'

const corsOptions = {
  origin: 'https://luckas-codeburger.vercel.app/',
  credentials: true,
}

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.app.use(cors(corsOptions))
    this.routes()
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use('/product-file', express.static(resolve(__dirname, "..", "uploads")))
    this.app.use('/category-file', express.static(resolve(__dirname, "..", "uploads")))
  }

  
  routes() {
    this.app.use(routes)
  }
}

export default new App().app