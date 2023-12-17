import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'
import { where } from 'sequelize'
//validação dos dados que vão chegar
class ProductController {
    async store (request, response){
        const schema = Yup.object().shape({ //formato do objeto abaixo:
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(), //após criar o relacionamento, alteramos o "category: Yup.string()" para "category_id: YUP.number"
            offer: Yup.boolean(), //não é obrigatório, informa se o produto está em oferta ou não
        })
        

        // caso ele não atenda ao formato exigido acima ele vai dar erro conforme no UserControllers, dizendo o que está de errado
        try {
                await schema.validateSync(request.body, {abortEarly:false})
        } catch (err) {
                    return response.status(400).json({error: err.errors})
        }

        // verficando se a pessoa que está logado é o admin:
        const { admin: isAdmin } = await User.findByPk(request.userId) // Ele vai pegar as informações de userid dentro do token e vai pegar a informação admin que tem dentre as informações do usuário (true ou false)
            if(!isAdmin){
                return response.status(401).json()
            }

        //arquivos validados, vamos pegalos:
        // O nosso arquivo não está no body, está dentro de um file, então temos que busca-lo no request.file
        const {filename: path} = request.file //estou pegando só o filename de dentro do file; utilizamos os ":" para dar um novo nome ao filename
        const {name, price, category_id, offer} = request.body //após criar o relacionamento, alteramos o "category" para "category_id"

        const product = await Product.create({
            name,
            price,
            category_id, //após criar o relacionamento, alteramos o "category" para "category_id"
            path,
            offer, //após add coluna offer na planilha produtos
        });
        
        return response.json( product )
    }

    async index (request, response){
        const products = await Product.findAll({ //procure todos os produtos dentro dessa variavel //após criar o relacionamento, dentro dos parênteses vamos adicionar:
            include: [ //vamos incluir os itens abaixo:
                {
                    model: Category, //vamos pegar do model Category
                    as: 'category', // vamos chama-lo de category
                    attributes: ['id', 'name'] // e vamos pegar os itens id e name apenas
                }
            ]
        }) 

        //console.log(request.userId)

        return response.json(products)  // retorna todos os produtos
    }

    async update (request, response){ // copiamos o store lá de cima pra ficar mais prático
        const schema = Yup.object().shape({ //formato do objeto abaixo:
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(), 
            offer: Yup.boolean(), 
        }) //nenhum item acima é obrigatório, pq eu posso querer mudar apenas um deles
        

        // caso ele não atenda ao formato exigido acima ele vai dar erro conforme no store, dizendo o que está de errado
        try {
                await schema.validateSync(request.body, {abortEarly:false})
        } catch (err) {
                    return response.status(400).json({error: err.errors})
        }

        // verficando se a pessoa que está logado é o admin:
        const { admin: isAdmin } = await User.findByPk(request.userId) // Ele vai pegar as informações de userid dentro do token e vai pegar a informação admin que tem dentre as informações do usuário (true ou false)
            if(!isAdmin){
                return response.status(401).json()
            }
            //após as validações vamos verificar se o ID digitado para a alteração é um ID válido
            const id = request.params.id
            const products = await Product.findByPk(id)
            if(!products){
                return response.status(401).json({error: 'Make sure your product ID is correct'})
            }

        //arquivos validados, vamos pegalos:
        // A foto não está no body, está dentro de um file, então temos que busca-lo no request.file
        let path
        if(request.file){
        path = request.file.filename } //fizemos de outra forma para caso o update não seja na imagem, dai não vai ter uma imagem, assim não quebra a aplicaçãoa
        
        //estou pegando só o filename de dentro do file; utilizamos os ":" para dar um novo nome ao filename
        const {name, price, category_id, offer} = request.body //após criar o relacionamento, alteramos o "category" para "category_id"

        await Product.update({ //aqui eu to dizendo pra ele que dentro de produtos vamos alterar os itens abaixo
            name, //porém como na validação não é obrigatório, o Sequelize nos ajuda com isso e entende que se não colocamos, não vamos alterar
            price, //qualquer um desses itens
            category_id, 
            path,
            offer, 
        },
        { where: { id } } //aqui falamos onde vamos alterar esses dados da tabela do Product, no id 2, por exemplo.
        );
        
        return response.status(200).json({ message: 'Product  was updated'})
    }

}

export default new ProductController()