import * as Yup from 'yup'
import User from "../models/User"
import Jwt  from 'jsonwebtoken'
import auth from '../../config/auth'

class SessionController{
    async store(request, response) {

        const schema = Yup.object().shape({ //formato do objeto abaixo
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })
        const userEmailOrPasswordIncorrect = () => {
            return response.status(401).json({ error: "Make sure your password or email are correct"})
        }
        // pra entrar no if os dados precisam estar true, porém eu preciso usar  if se os docs estiverem false, então colocamos o ponto de exclamação antes da função:
        if (!(await schema.isValid(request.body))) userEmailOrPasswordIncorrect() // estou verificando se os dados são válidos (conforme regras do YUP) caso não seja cai aqui nesse if
        //aqui em cima eu aviso apenas que ele errou mas não posso dizer se foi  e-mail ou senha pra ficar mais seguro
        //ele vai retornar a função que eu criei lá em cima que é um retorno de error

        const { email, password} = request.body

        const user = await User.findOne({  // procurar se o e-mail que tá ali já existe, para não cadastrar repetido
            where: { email}, //se ele não acha ele retorna com null e daí cai no if.
        })
        //caso o usuário de false (denovo usamos o ponto de exclamação pq o if aceita só o true e com o ! ele inverte para false)
        if (!user) userEmailOrPasswordIncorrect() //ele vai retornar a função que eu criei lá em cima que é um retorno de error
                   
        // caso o usuário tenha inserido a senha incorreta, entra neste if (novamente o ! pq tem que ser false pra entrar aqui)
        //o checkPassoword vem do model User onde ele compara a senha digitada com a criptografada
        if(!(await user.checkPassword(password))) userEmailOrPasswordIncorrect() //ele vai retornar a função que eu criei lá em cima que é um retorno de error
                
        return response.json({ //aqui será a resposta que eu vou receber depois de todas as confirmações que foram feitas acima, caso estja tudo correto.
            id: user.id,
            email,
            name: user.name,
            admin: user.admin,
            token: Jwt.sign({ id: user.id, name: user.name }, auth.secret, {expiresIn: auth.expiresIn})
            // O token novo precisa de três parâmetros: 1) dado personalizado (colocamos o ID do usuário); 2) string única, gerada pelo MD5 3) quanto tempo o usuário pode ficar logado, em quanto tempo ele  expirará 
        }) //no 1o parâmetro adicionamos o name do usuário para utilizar na order (via token)
    }
}

export default new SessionController()