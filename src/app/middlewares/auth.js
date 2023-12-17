import  Jwt  from "jsonwebtoken";
import auth from "../../config/auth";

export default (request, response, next) => {
    const authToken = request.headers.authorization  // aqui pegamos o token que veio dentro do insomnia pra ver se tem um token
if(!authToken) {
    return response.status(401).json({ error: "token not proided"})  // caso não tenha, retornamos o erro
}
// par validar o token segue os códigos abaixo: vamos eliminar o Bearer e criar um array só com o token mesmo.
    const token = authToken.split(' ')[1]//toda vez que ele encontrar um espaço dentro dos dados informados ele cria um novo item do array.
    //adicionamos o [1] para ele retornar o item 1 do array
    
    try{ // vamos tentar validar o token:
        Jwt.verify(token, auth.secret, function(err, decoded){  //verify aceita os parametros: primeiro o token, segundo a palavra chave dentro do token e terceiro uma função
            //primeiro parametro da função é o erro e a segunda é o id do usuário (decoded)
            if(err) { 
                throw new Error() // caso ele tenha encontre o erro, colocamos o throw para ele cair no catch
            }
                // se não der erro, vai retornar o id do usuário, mais tarde vamos usar isso
        request.userId = decoded.id
        request.userName = decoded.name // adicionamos este item para que possamos buscar dentro do token o id e name de usuário, no order;

            return next() // coloca para renderizar o restante
        })
    } catch(err){
        return response.status(401).json({ error: "Token is Invalid"}) //erro caso não der certo a verificação do token
    }
}