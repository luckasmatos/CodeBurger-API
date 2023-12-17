import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class User extends Model { // extends = estendendo a class model dentro da classe Use; colocamos a palavra "super"
//na frente de um parâmetro que usamos na classe pai (classe que estendemos para essa que criamos agora)
//método estático = não preciso instanciar a classe
    static init(sequelize) {  //esse init estou criando
        super.init(  // esse init estou herdando do Model
            { // campos que o usuário vai ter, conforme colocamos na migration;
                name: Sequelize.STRING,
                email:Sequelize.STRING,
                password: Sequelize.VIRTUAL, //virtual pq recebo mas não coloco no banco de dados
                password_hash: Sequelize.STRING,
                admin: Sequelize.BOOLEAN,
            }, // não colocamos ID nem o created e updated = created e updated são criados automaticamente; ID são chave rimaria, dai não coloca no model;
            {
                sequelize, //segundo parâmetro que o init do Model pede
            }
        )

        this.addHook('beforeSave', async (user) => { //antes de salvar fazemos a criptografia dos dados
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10)
            }
        })
        return this
    }

    checkPassword(password){ //aqui o bcrypt nos ajuda a comparar a senha enviada pelo usuário com a senha criptografada
       return bcrypt.compare(password, this.password_hash) //aqui ele vai me retornar true caso as senhas batem e false caso as senhas não batem
    }
}

export default User