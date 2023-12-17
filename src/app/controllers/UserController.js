/* Temos que ter os aqui de baixo, mas só pode ter um de cada:
store => Cadastrar / Adicionar
index => Listar vários
show => Listar apenas um
update  => Atualizar
delete  => Deletar
*/
import { v4 } from "uuid"
import User from "../models/User.js"
import * as Yup from 'yup'

class UserController{
    async store(request, response){

        const schema = Yup.object().shape({ // estou dizendo que o yup vai receber um objeto que é o request.body
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        })

    try {
        await schema.validateSync(request.body, {abortEarly:false})
    } catch (err) {
        return response.status(400).json({error: err.errors})
    }

        const {name, email, password, admin } = request.body

        const userExists = await User.findOne({  // procurar se o e-mail que tá ali já existe, para não cadastrar repetido
            where: { email}, //se ele não acha ele retorna com null e daí cai no if.
        })
        if (userExists){
           return response.status(400).json({ error: 'User already exists'})
        }

        console.log (userExists)

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        })

        return response.status(201).json({ id: user.id, name, email, admin})
    }
}

export default new UserController()