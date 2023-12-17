import * as Yup from 'yup'
import Product from '../models/Products.js'
import Category from '../models/Category.js'
import Order from '../schemas/Order.js'
import User from '../models/User.js'

class OrderController{
    async store(request, response){

        const schema = Yup.object().shape({ // estou dizendo que o yup vai receber um objeto que é o request.body
            products: Yup.array().required().of(Yup.object().shape({   // o primeiro item que ele recebe é um produto do tipo array e colocamos o of pra dizer como tem que ser dentro do array:
                id: Yup.number().required(),  // vai ter um id que é number e é obrigatório
                quantity: Yup.number().required(), // vai ter uma quantidade que é number e é obrigatório
            })),   
        }) // no of informamos que o array é um objeto e shape é pra dizer como é esse objeto.
        console.log(request)
    try { //itens abaixo copiamos do UserControllers
        await schema.validateSync(request.body, {abortEarly:false})
    } catch (err) {
        return response.status(400).json({error: err.errors})
    }

    const productsIds = request.body.products.map((product) => product.id) // aqui vamos pegar o ID do produtor com a ajuda do map. ele vai criar um array com os ids dos produtos

    // console.log(productsIds) = fazemos para garantir que vem um array do que criamos;

    const updatedProducts = await Product.findAll({  // variavel para armazenar os produtos, await pq vamos pegar no banco de dados, importamos o model de products,
        where: { // pq precisamos dos produtos dentro da tabela de products; findall (todas as ocorrências com esses ID); where, onde procurar?
            id: productsIds, // precisamos do ID que está dentro desse array aqui (a função que criamos antes pra buscar os Ids)
        }, // ele vai retornar tudo que tem desses IDs no insomnia em formato de objeto cada ID. mas precisamos modificar alguma coisa...
        include: [ // precisamos incluir o nome da categoria desse produto, 
            {
                model: Category, //pra isso vamos buscar lá no model Category, 
                as: 'category', // vamos chama-lo de category,
                attributes: ["name"], // e vamos buscar apenas o atributo "name" dele
            }
        ] //apesar disso precisamos modelar as informações que chegam pro front-end
    })

    const editedProducts = updatedProducts.map(product => { //aqui vamos construir o que o front-end realmente precisa conforme o Schema Order:
        // para não dar erro de misturar as quantdades entre os produtos, vamos nos guiar pelo index e pelo id
        const productIndex = request.body.products.findIndex( // aqui vamos procurar o index 
            (requestProduct) => requestProduct.id === product.id)
            //quero encontrar o id do product que está no pedido(order) dentro da informação que tem no request.body e passar qual é o index dele
            //findIndex vai nos trazer a posição do array em que está o item que estamos procurando
            // vou pegar o do request e chamar de requestProducts e precisamos do ID dele e comparar com o products.id que é o que tá vindo do primeiro map.



        const newProduct = { //através do map ele vai mapear tudo que tem no products e vai nos trazer apenas o que pedimos no objeto abaixo:
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category.name,
            url: product.url,
            quantity: request.body.products[productIndex].quantity, // aqui vou pegar a quantidade que está no body, conforme a posição (index) que eu vou encontrar aqui no []
        }
        return newProduct
    })

    const order = {  //aqui vamos criar como o pedido vai retornar para o front-end
        user: { // ele vai ter que retornar as informações do usuário, pra saber quem fez o pedido
            id: request.userId, //pra isso eele vai pegar as informações do token, como o ID
            name: request.userName, // como modificamos o auth(middleware) vamos buscar o name também do token
        },
        products: editedProducts, //aqui vamos retornar no pedido os produtos que editamos na variável anterior
        status: "pedido realizado", // aqui vamos retornar o status, o primeiro que será pedido realizado.
    }

    const orderResponse = await Order.create(order) //aqui criamos uma variável para criar uma ordem indo no schema Order e usando o create com base nas info que colocamos na order acima
    //isso vai gravar no MongoDB (veremos no MongoDB Compass)
      return response.status(201).json(orderResponse)
    }

    async index(request, response) { // rota que vai mostrar todos os pedidos que temos (GET)
        const orders = await Order.find() //utilizando o mongoDB faremos um "find" e ele retornará todas as ocorrencias que encontrar nessa tabela. após criamos a rota GET.
        return response.json(orders)
    }

    async update(request, response) { //aqui vamos criar uma rota PUT para alterar o status do pedido

        const schema = Yup.object().shape({ // estou dizendo que o yup vai receber um objeto que é o request.body
            status: Yup.string().required()   // aqui ele vai fazer a verificação se o status está chegando certinho
        }) 
        
    try { //try e catch abaixo copiamos do async store lá de cima
        await schema.validateSync(request.body, {abortEarly:false})
    } catch (err) {
        return response.status(400).json({error: err.errors})
    }

        // verficando se a pessoa que está logado é o admin:
        const { admin: isAdmin } = await User.findByPk(request.userId) // Ele vai pegar as informações de userid dentro do token e vai pegar a informação admin que tem dentre as informações do usuário (true ou false)
        if(!isAdmin){
            return response.status(401).json()
        }

        const { id } = request.params // vamos pegar o iD da url 
        const { status } = request.body // vamos pegar o novo status do body (já verificado acima)
        // vamos inserir essa nova informação no MongoDb
       try{
        await Order.updateOne({_id: id}, { status })   //vamos pegar o order, o pedido já pronto, e fazer apenas uma atualização (updateOne)
    //1a parametro é qual que eu quero encontrar, encontramos pelo ID (no Mongo é "_id" e vai comparar com o id que vem da url)
    // 2a parametro é o objeto que eu quero atualizar, só "status" é como se fosse "status: status"
        } catch(error){ //aqui no try/catch é para caso ele receba um ID que ele não reconheça dentro do Mongo, ele vai retornar com erro.
          return response.status(400).json({ error: error.message })  
        }
        return response.json({message: 'Status was updated'}) // retornaremos com uma mensagem de sucesso //bora criar a rota PUT
    } 
    

}

export default new OrderController()