import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import configDatabase from '../config/database'
import User from '../app/models/User'
import Product from '../app/models/Products'
import Category from '../app/models/Category'

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
            'mongodb://mongo:Dh-5EaDheB-hbc531ga-2aCcG6aH2hg6@monorail.proxy.rlwy.net:50108',
            {
                useNewUrlParser:true,
                useUnifiedTopology: true,
            })
    }
}

export default new Database()