import Sequelize, { Model } from "sequelize";

class Category extends Model {
    static init(sequelize){
        super.init({  //campo Id é gerado automaticamente por isso não está aqui
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL, //campo virtual não será gravado
                get(){ //mas quando der um get ele vai trazer a url e mostrar a imagem
                    return `https://codeburger-api-production.up.railway.app/category-file/${this.path}` //gera pegando esse endereço mais o nome do arquivo path    
                }
            }
        },
        {
            sequelize,
        })
        return this
    }
}

export default Category