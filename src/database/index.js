import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import { configDatabase } from '../config/database.js'
import User from '../app/models/User.js'
import Product from '../app/models/Products.js'
import Category from '../app/models/Category.js'

const models = [User, Product, Category] 

class Database {
    constructor() {
        this.init()
        this.mongo()
    }

    init() {
        this.connection = new Sequelize('postgresql://postgres:Eb44*D5CGdb244d6bG3Gc4GAC-1ff5gF@monorail.proxy.rlwy.net:44840/railway')
        models
        .map((model) => model.init(this.connection))
        .map((model) => model.associate && model.associate(this.connection.models))
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            'mongodb://mongo:Edf3CeaGAGGG14e4GeBC4fABdfGf-BcA@roundhouse.proxy.rlwy.net:59654',
            {
                useNewUrlParser:true,
                useUnifiedTopology: true,
            })
    }
}

export default new Database()