import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({  //isso está na documentação do Mongoose esse formato.
    user: {  // dados do usuário que está fazendo o pedido <id e name>
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    products: [ // dados dos produtos solicitados, como geralemnte é mais que um, fazemos um array e depois os objetos 
        { // <id, name, price,category, url da imagem, quantidade d produto>
            id: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            category: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {  // depois dados do status, se ta preparando, saiu pra entrega, entregue...
        type: String,
        required: true,
    },
},
    {
        timestamps: true, // este aqui faz o created e o updated no mongoose
    }
)

export default mongoose.model('Order', OrderSchema ) //por fim temos que exportar dessa forma
//este model o 1a parâmetro é qual vai ser o nome dele e o 2a parâmetro é o objeto que criamos lá em cima.