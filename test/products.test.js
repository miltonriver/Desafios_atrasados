import mongoose from "mongoose";
import ProductDaoMongo from "../src/daos/Mongo/productsDaoMongo.js";
import Assert from "node:assert";
import { configObject } from "../src/config/connectDB.js";
import { title } from "node:process";

mongoose.connect(configObject.mongo_url)
const assert = Assert.strict

describe('Testing Products DAO', () => {
    before(function(){
        this.productDaoMongo = new ProductDaoMongo()
    })

    beforeEach(function(){
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    })

    it('El Dao debe poder obtener todos los productos en formato de arreglo', async function(){
        console.log(this.productDaoMongo)

        const result = await this.productDaoMongo.get()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('El Dao debe poder agregar un producto correctamente a la base de datos', async function(){
        let mockProduct = {
            title: 'Producto 1',
            description: 'Descripción del producto 1',
            price: 156,
            code: 'abcede4567898',
            stock: 95,
            category: "nuevos"
        }

        const result = await this.productDaoMongo.create(mockProduct)
        assert.ok(result._id)
    })
})