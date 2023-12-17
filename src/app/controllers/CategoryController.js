import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'
//validação dos dados que vão chegar
class CategoryController {
    async store (request, response){
        const schema = Yup.object().shape({ //formato do objeto abaixo:
            name: Yup.string().required(),
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
        const {name} = request.body

        const categoryExists = await Category.findOne({  // procurar se a categoria que tá ali já existe, para não cadastrar repetido
            where: { name }, //se ele não acha ele retorna com null e daí cai no if.
        })
        if (categoryExists){
           return response.status(400).json({ error: 'Category already exists'}) // erro avisando que já existe
        }

        const { id } = await Category.create({ name, path });
        
        return response.status(201).json({ id, name  })
    }

    async index (request, response){
        const categories = await Category.findAll() //procure todos as categorias dentro dessa variavel

        return response.json(categories)  // retorna todos as categorias
    }

    async update (request, response){
        try{
            const schema = Yup.object().shape({ //formato do objeto abaixo:
                name: Yup.string(),
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

                const {name} = request.body
                const {id} = request.params

                // vamos verificar se o ID está correto antes da alteração:
                const category = await Category.findByPk(id)
                    if(!category){
                        return response.status(401).json({error: 'Make sure your category ID is correct'})
                    }

                // A foto não está no body, está dentro de um file, então temos que busca-lo no request.file
                let path
                if(request.file){
                path = request.file.filename } //fizemos de outra forma para caso o update não seja na imagem, dai não vai ter uma imagem, assim não quebra a aplicaçãoa

                await Category.update({ name, path },{ where: { id }});
                
                return response.status(200).json()
        } catch(err){

        }
    }   
}

export default new CategoryController()