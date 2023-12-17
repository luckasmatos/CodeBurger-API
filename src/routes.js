import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./App/Controllers/UserController";
import SessionController from "./App/Controllers/SessionController";
import ProductController from "./App/Controllers/ProductController";
import CategoryController from "./App/Controllers/CategoryController";
import authMiddleware from "./App/middleware/auth"; // importando o Middleware de autenticação
import OrderController from "./App/Controllers/OrderController";

const upload = multer(multerConfig) // criamos a variável com o Multer + config que criamos ao usar o Multer e vamos usa-la na rota dos produtos

const routes = new Router(); // importado conforme a documentação do Express

routes.post("/users", UserController.store)
routes.post("/sessions", SessionController.store)

routes.use(authMiddleware) // todas as rotas que tiverem abaixo disso (aqui no código) vão receber meu Middleware e será autenticado

routes.post("/products", upload.single("file"), ProductController.store) //single por que vamos deixar fazer upload de apenas um arquivo / single pede um nome em string
//nesta rota vamos juntar o multer e o Productcontroller para que no insomnia nós adicionarmos
//um arquivo [upload.single] + as informações do arquivo[ProductController] e todos chegarem junto no banco de dados
routes.get('/products', ProductController.index) // rota de get para mostrar todos o nossos produtos 
routes.put("/products/:id", upload.single("file"), ProductController.update) // rota put para alterar os daods do produto de um id expecífico.

routes.post("/categories", upload.single("file"), CategoryController.store) //nesta rota vamos criar uma nova categoria // adicionado path na categoria e aqui o single-file
routes.get('/categories', CategoryController.index) // rota de get para mostrar todas as categorias 
routes.put("/categories/:id", upload.single("file"), CategoryController.update) // rota put para alterar a categoria de um id expecífico.

routes.post("/orders", OrderController.store) //nesta rota vamos criar uma nova order, novo pedido
routes.get("/orders", OrderController.index) // rota get para retornar todos os pedidos,orders, criados.
routes.put("/orders/:id", OrderController.update) // rota put para alterar o status de um id expecífico.


export default routes;